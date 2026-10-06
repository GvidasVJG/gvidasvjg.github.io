class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)

    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

done = False

def find_closest(inputw, words):
    global done
    done = False
    currw = min(words, key=lambda word: levenshtein_distance(inputw, word))
    done = True
    return currw

def rand_symb(chfrom=0X2800, chto=0X2880):
    from random import randint
    return f'{chr(randint(chfrom, chto))}'

def rand_symbs(leng):
    ret = ''
    for _ in range(leng):
        ret += rand_symb()
    return ret

def animate(leng):
    from itertools import cycle 
    from time import sleep
    import os

    global done
    term_size = list(os.get_terminal_size())[0]-10

    # Fun animations
    # Animation #1
    # frames = ['|', '/', '–', '\\']
    # Animation #2
    # frames = ['◐', '◓', '◑', '◒']
    # Animation #3
    # frames = ['◡◡', '⊙⊙', '◠◠', '⊙⊙']
    # Animation #4
    # frames = [f'{chr(a)}' for a in range(0X2800, 0X2881)]
    # Animation #5
    # frames = [f'{chr(a)}' for a in range(0X2588, 0X258F)]
    # frames += reversed(frames)
    # Animation #6
    frames = [f'{rand_symbs(leng)}' for _ in range(100)]
    frames_back = list(reversed(frames))
    del frames_back[0]
    frames += frames_back
    # End of Fun animations

    for c in cycle(frames):
        if done:
            break
        print(f'\rSearching {c:{term_size}}', end="")
        sleep(0.05)

def generate(to_gen):
    import os
    from pickle import load

    to_load = []
    probs = None
    words_list = None    
    if os.path.isfile('vdslm_model.bin'):
        with open('vdslm_model.bin', 'rb') as trained_file:
            to_load = load(trained_file)
        probs = to_load[0]
        words_list = to_load[1]
    else:
        print(f'{bcolors.FAIL}Trained model not found.{bcolors.ENDC}\nRun {bcolors.OKCYAN}python ./vdslm.py -t{bcolors.ENDC} to train a model based on data.txt file')
        print('Exiting...')
        exit()

    start_input = input('Enter the starting word: ')
    gen_len = to_gen
    currw = start_input.split()[-1]

    if currw not in probs:
        from threading import Thread
        inputw = currw
        print(f'{bcolors.WARNING}The word `{inputw}` is not in the training data.{bcolors.ENDC}')
        print(f'Searching for the closest word in training data to the word `{inputw}`.')
        t = Thread(target=animate, args=(len(inputw),))
        t.start() 
        currw = find_closest(inputw, words_list)
        term_size = list(os.get_terminal_size())[0]-10
        print(f'\r{"Done!":{term_size}}')
        print(f'Continuing with the closest word `{currw}`...')
    
    print('OUTPUT: \n---')
    symb = '.,()-–\n\'\"'
    from random import random as rand
    for i in range(gen_len):
        if currw in symb or i == 0:
            print(f'{currw}', end="")
        else:
            print(f' {currw}', end="")

        nextw_p = dict(sorted(probs[currw].items(), key=lambda x: x[1], reverse=True))
        select = rand()
        for word, val in nextw_p.items():
            if select <= val:
                nextw = word
                break
            else:
                select -= val
        currw = nextw

    print('\n---')
    input("Press ENTER to exit")