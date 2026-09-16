import os
lock = 'C:/Users/Jayto/Documents/Home/.git/index.lock'
if os.path.exists(lock):
    os.remove(lock)
    print('lock removed')
else:
    print('no lock')
