/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/random.json`.
 */
export type Random = {
  "address": "EFiw9bYPsvyHhdMS8Xxc78f8ZkFJQh6v5RwabCbEEdAa",
  "metadata": {
    "name": "random",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "callbackRollDice",
      "discriminator": [
        129,
        76,
        217,
        160,
        252,
        234,
        19,
        238
      ],
      "accounts": [
        {
          "name": "vrfProgramIdentity",
          "docs": [
            "This check ensure that the vrf_program_identity (which is a PDA) is a singer",
            "enforcing the callback is executed by the VRF program trough CPI"
          ],
          "signer": true,
          "address": "9irBy75QS2BN81FUgXuHcjqceJJRuc9oDkAe8TKVvvAw"
        },
        {
          "name": "dice",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  68,
                  73,
                  67,
                  69
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "randomness",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "initTreasuries",
      "discriminator": [
        2,
        129,
        93,
        25,
        226,
        210,
        24,
        154
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "solanaMint",
          "writable": true
        },
        {
          "name": "solanaTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  79,
                  76,
                  65,
                  78,
                  65
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "tokenTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeDice",
      "discriminator": [
        58,
        173,
        45,
        92,
        167,
        0,
        154,
        224
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "dice",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  68,
                  73,
                  67,
                  69
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializePoker",
      "discriminator": [
        215,
        255,
        178,
        27,
        13,
        11,
        125,
        209
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "poker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  75,
                  69,
                  82
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "joinPoker",
      "discriminator": [
        250,
        68,
        9,
        192,
        117,
        180,
        189,
        10
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "poker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  75,
                  69,
                  82
                ]
              }
            ]
          }
        },
        {
          "name": "pokerPlayer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  107,
                  101,
                  114,
                  80,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "poker"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "tokenTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "buyInAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pokerCall",
      "discriminator": [
        148,
        51,
        42,
        140,
        244,
        36,
        225,
        141
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "poker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  75,
                  69,
                  82
                ]
              }
            ]
          }
        },
        {
          "name": "pokerPlayer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  107,
                  101,
                  114,
                  80,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "poker"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "nextPokerPlayer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "i64"
        }
      ]
    },
    {
      "name": "pokerShowCards",
      "discriminator": [
        88,
        69,
        69,
        10,
        237,
        209,
        81,
        215
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "poker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  75,
                  69,
                  82
                ]
              }
            ]
          }
        },
        {
          "name": "pokerPlayer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  107,
                  101,
                  114,
                  80,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "poker"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "nextPokerPlayer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "card1",
          "type": "u8"
        },
        {
          "name": "card2",
          "type": "u8"
        }
      ]
    },
    {
      "name": "pokerStart",
      "discriminator": [
        221,
        152,
        12,
        13,
        153,
        131,
        230,
        141
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "poker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  75,
                  69,
                  82
                ]
              }
            ]
          }
        },
        {
          "name": "pokerPlayer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  107,
                  101,
                  114,
                  80,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "poker"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "bigBlindPokerPlayer",
          "writable": true
        },
        {
          "name": "smallBlindPokerPlayer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "rollDice",
      "discriminator": [
        27,
        140,
        230,
        215,
        37,
        178,
        226,
        114
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "dice",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  68,
                  73,
                  67,
                  69
                ]
              }
            ]
          }
        },
        {
          "name": "oracleQueue",
          "writable": true,
          "address": "Cuj97ggrhhidhbu39TijNVqE74xvKJ69gDervRUXAxGh"
        },
        {
          "name": "programIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "vrfProgram",
          "address": "Vrf1RNUjXmQGjmQrQLvJHs9SNkvDJEsRVFPkfSQUwGz"
        },
        {
          "name": "slotHashes",
          "address": "SysvarS1otHashes111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "clientSeed",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "dice",
      "discriminator": [
        226,
        84,
        34,
        89,
        97,
        136,
        165,
        146
      ]
    },
    {
      "name": "poker",
      "discriminator": [
        207,
        90,
        194,
        231,
        6,
        133,
        225,
        253
      ]
    },
    {
      "name": "pokerPlayer",
      "discriminator": [
        61,
        182,
        31,
        29,
        49,
        115,
        135,
        125
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "fullTable",
      "msg": "Full Table"
    }
  ],
  "types": [
    {
      "name": "dice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastResult",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "poker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minBuyIn",
            "type": "u64"
          },
          {
            "name": "maxBuyIn",
            "type": "u64"
          },
          {
            "name": "minPlayerCount",
            "type": "u8"
          },
          {
            "name": "maxPlayerCount",
            "type": "u8"
          },
          {
            "name": "bigBlind",
            "type": "u64"
          },
          {
            "name": "smallBlind",
            "type": "u64"
          },
          {
            "name": "potAmount",
            "type": "u64"
          },
          {
            "name": "nextSkipTime",
            "type": "i64"
          },
          {
            "name": "currentRaise",
            "type": "u64"
          },
          {
            "name": "lastRaise",
            "type": "u64"
          },
          {
            "name": "card1",
            "type": "u8"
          },
          {
            "name": "card2",
            "type": "u8"
          },
          {
            "name": "card3",
            "type": "u8"
          },
          {
            "name": "card4",
            "type": "u8"
          },
          {
            "name": "card5",
            "type": "u8"
          },
          {
            "name": "playerNo",
            "type": "u64"
          },
          {
            "name": "currentPlayerId",
            "type": "u64"
          },
          {
            "name": "dealerId",
            "type": "u64"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "currentlyPlaying",
            "type": "u8"
          },
          {
            "name": "showdown",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "pokerPlayer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "poker",
            "type": "pubkey"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "chipAmount",
            "type": "u64"
          },
          {
            "name": "raisedAmount",
            "type": "u64"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "card1",
            "type": "u8"
          },
          {
            "name": "card2",
            "type": "u8"
          },
          {
            "name": "username",
            "type": "string"
          }
        ]
      }
    }
  ]
};
