from string import ascii_lowercase, ascii_uppercase


def find_mult_inverse(number, alph_size):
    inverse = 1

    while (number * inverse) % alph_size != 1:
        inverse += 1

        if inverse > alph_size:
            raise ValueError("The key you entered can't be used for this cipher method!")

    return inverse


def additive_cipher_encrypt(key, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[(alph.index(letter) + key) % alph_size] for letter in message]

    return "".join(result)


def additive_cipher_decrypt(key, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[(alph.index(letter) - key) % alph_size] for letter in message]

    return "".join(result)


def multiplicative_cipher_encrypt(key, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[(alph.index(letter) * key) % alph_size] for letter in message]

    return "".join(result)

def multiplicative_cipher_decrypt(key, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[(alph.index(letter) * find_mult_inverse(key, alph_size)) % alph_size] for letter in message]

    return "".join(result)


def affine_cipher_encrypt(key1, key2, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[(alph.index(letter) * key1 + key2) % alph_size] for letter in message]

    return "".join(result)


def affine_cipher_decrypt(key1, key2, message, alph=ascii_uppercase):
    alph_size = len(alph)
    result = [alph[((alph.index(letter) - key2)) * find_mult_inverse(key1, alph_size) % alph_size] for letter in message]
    
    return "".join(result)
