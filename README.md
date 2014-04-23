btsync PaperSecret Converter
============================

This little tool turns [BitTorrent Sync](http://www.bittorrent.com/sync) Secrets into 15 words you can write down and copy more easily.

The idea and the wordlist is from the [BIP 0039](https://en.bitcoin.it/wiki/BIP_0039) reference implementation: [trezor/python-mnemonic](https://github.com/trezor/python-mnemonic)


TODO
----

* Autocompletion for the words to input them more easily
* Design improvements (Sorry, first time i'm using bootstrap)


How does it work:
-----------------

btsync uses 33 characters for displaying the secret to the user.
The secret only contains characters `[A-Z]` and `[2-7]`.  

This results in 26 + 6 = 32 = 2<sup>5</sup> different characters, which can be stored in 5 bits.  

With 33 of this characters the secret has 33 &middot; 5 = 165 bits of data.

With a wordlist of 2048 = 2<sup>11</sup> words the data can now be splitted into 165/11 = 15 words.
And a single word then represents its number in the list as data.