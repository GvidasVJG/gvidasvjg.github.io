def readData(fname):
    words = ''
    with open(fname, 'r') as learningData:
        words = learningData.read().lower()
    words = words.replace(',',' , ').replace('.', ' . ').replace('-',' - ').replace('–',' – ').replace('(',' ( ').replace(')',' ) ').replace('\n', ' \n ').split()
    while words.count(''):
        words.remove('')
    return words

def count_following_words(word_list):
    if len(word_list) > 10**5:
        print('This will take a while...')
    print('Counting the words in training data')
    print(f'Total words: {len(word_list)}')

    word_count = {}

    for i in range(len(word_list)):
        current_word = word_list[i-1]
        next_word = word_list[i]

        if current_word not in word_count:
            word_count[current_word] = {}

        if next_word not in word_count[current_word]:
            word_count[current_word][next_word] = 0

        word_count[current_word][next_word] += 1
        print(f'\rProcessing {i+1}/{len(word_list)}: {((i+1)/len(word_list)*100):.2f}%', end='')  

    print('\nDone counting words\n')
    return word_count

def countProbs(counts):
    print('Counting the probablities of word successors')
    probs = {}
    for j, keyw in enumerate(counts):
        probs[keyw] = {}
        for nextw in counts[keyw]:
            number_of = 0
            for key, item in counts[keyw].items():
                number_of += item
            probs[keyw][nextw] = counts[keyw][nextw]/number_of
        print(f'\rProcessing {j+1}/{len(counts)}: {((j+1)/len(counts)*100):.2f}%', end='')
    print('\nDone counting probablities\n')
    return probs

def dumpTrainingData(probs, words):
    from pickle import dump
    print('Dumping data to vdslm_model.bin')
    to_dump = [probs, words]
    with open('vdslm_model.bin', 'wb') as trained_file:
        dump(to_dump, trained_file)
    
    print('Done dumping training data\n')

def train(fname):
    print('Starting training\n')
    words_list = readData(fname)
    counts = count_following_words(words_list)
    probs = countProbs(counts)
    dumpTrainingData(probs, words_list)
    print('Done training')
    input("Press ENTER to exit")