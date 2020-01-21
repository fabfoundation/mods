#!/usr/bin/env python3
#
# serialserver.py
#    send a serial file with handshaking
#
# Neil Gershenfeld 1/17/20
#
# This work may be reproduced, modified, distributed,
# performed, and displayed for any purpose, but must
# acknowledge the mods project. Copyright is
# retained and must be preserved. The work is provided
# as is; no warranty is provided, and users accept all 
# liability.
#
# imports
#
import sys,serial,asyncio,websockets,json,time
#
# command line
#
if (len(sys.argv) != 3):
   print("command line: serialserver.py address port")
   print("   address = client address")
   print("   port = port")
   sys.exit()
client = sys.argv[1]
port = int(sys.argv[2])
#
# WebSocket handler
#
async def receive(websocket,path):
   while (1):
      msg = await websocket.recv()
      address = websocket.remote_address[0]
      if (address != client):
         #
         # reject client
         #
         print("connection rejected from "+address)
         continue
      #
      # accept client
      #
      print("connection accepted from "+address)
      vars = json.loads(msg)
      if (vars['type'] == 'open'):
         #
         # open port
         #
         device = vars['device']
         speed = int(vars['baud'])
         flow = vars['flow']
         try:
            if (flow == "xonxoff"):
               s = serial.Serial(
                  device,baudrate=speed,xonxoff=True, timeout=0)
            elif (flow == "rtscts"):
               s = serial.Serial(
                  device,baudrate=speed,rtscts=True, timeout=0)
            elif (flow == "dsrdtr"):
               s = serial.Serial(
                  device,baudrate=speed,dsrdtr=True, timeout=0)
            elif (flow == "none"):
               s = serial.Serial(
                  device,baudrate=speed,timeout=0)
            s.flushInput()
            s.flushOutput()
            await websocket.send(f"open {device} at {speed} with {flow}")
         except serial.SerialException as err:
            await websocket.send(str(err))
      elif (vars['type'] == 'close'):
         await websocket.send(f"close {device}")
         s.close()
      elif (vars['type'] == 'command'):
         #
         # send command
         #
         data = vars['contents']
         n = 0
         for c in data:
            if (flow == "dsrdtr"):
               while (s.getDSR() != True):
                  time.sleep(0.001)
            elif (flow == "rtscts"):
               while (s.getCTS() != True):
                  time.sleep(0.001)
            s.write(c.encode('ascii'))
            s.flush()
            n += 1
            percent = (100.0*n)/len(data)
            await websocket.send(str(percent))
      elif (vars['type'] == 'file'):
         #
         # send file
         #
         data = vars['contents']
         n = 0
         for c in data:
            if (flow == "dsrdtr"):
               while (s.getDSR() != True):
                  time.sleep(0.001)
            elif (flow == "rtscts"):
               while (s.getCTS() != True):
                  time.sleep(0.001)
            s.write(c.encode('ascii'))
            s.flush()
            n += 1
            percent = (100.0*n)/len(data)
            await websocket.send(str(round(percent))+'%')
         await websocket.send("done")
#
# start server
#
start_server = websockets.serve(receive,'localhost',port)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()