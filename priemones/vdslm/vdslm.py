from vdslm_train import *
from vdslm_generate import *

def main():
    import os
    from sys import argv
    os.system('clear')
    if len(argv) < 2:
        print(f"{bcolors.FAIL}No arguments provided. \nExiting...{bcolors.ENDC}")
        exit()
    if argv[1] == '-t':
        filename = 'data.txt'
        if len(argv) > 2:
            filename = argv[2]
        train(filename)
    elif argv[1] == '-g':
        to_gen = 50
        if len(argv) > 2:
            to_gen = int(argv[2])
        generate(to_gen)
    elif argv[1] == '-f':
        os.system('python3 ./vdslm.py -t && python3 ./vdslm.py -g')
    else:
        print(f"{bcolors.FAIL}No valid argument provided.{bcolors.ENDC}")
        print(f"{bcolors.OKCYAN}Valid arguments: -f for first run, -t to train or -g to generate{bcolors.ENDC}")


if __name__ == "__main__":
    main()