
#min

for count, word in enumerate(js):
	word_len = len(word.keys()[0])
	if (count < 1500 and word_len > 2):
		lo.append(word.keys()[0])


#max

for count, word in enumerate(js):
        word_len = len(word.keys()[0])
        if (word_len > 3 and word_len < 7) or \
            (word_len < 16 and count < 10000 and word_len > 7) or \
                (count < 2000 and word_len > 2):
                        lo.append(word.keys()[0])


#med

for count, word in enumerate(js):
	word_len = len(word.keys()[0])
	if (word_len > 3 and word_len < 7 and count < 10000) or \
	        (word_len < 16 and count < 3000 and word_len > 7) or \
	        (count < 1000 and word_len > 2):
		lo.append(word.keys()[0])
