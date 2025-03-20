import threading 

def run_bot():
    while True:
        send_message()

bots = [] 
for _ in range(10):
    bot_thread = threading.Thread(target=run_bot)
    bot.append(bot_thread)
    bot_thread.start()

