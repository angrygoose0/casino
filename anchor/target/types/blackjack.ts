/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blackjack.json`.
 */
export type Blackjack = {
  "address": "GUQb7sfh9G4wL3hEUkSkPPifLTb45z6GK5VtRcgZSFSS",
  "metadata": {
    "name": "blackjack",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "anteBlackjack",
      "discriminator": [
        191,
        139,
        102,
        18,
        220,
        51,
        14,
        189
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "blackjack",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  76,
                  65,
                  67,
                  75,
                  74,
                  65,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "deck",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  68,
                  69,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "blackjack"
              }
            ]
          }
        },
        {
          "name": "blackjackHand",
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
          "name": "handId",
          "type": "u8"
        },
        {
          "name": "playerBet",
          "type": "u64"
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
      "name": "joinBlackjack",
      "discriminator": [
        177,
        235,
        55,
        118,
        97,
        184,
        97,
        68
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "blackjack",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  76,
                  65,
                  67,
                  75,
                  74,
                  65,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "deck",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  68,
                  69,
                  67,
                  75
                ]
              },
              {
                "kind": "account",
                "path": "blackjack"
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
    }
  ],
  "accounts": [
    {
      "name": "blackJack",
      "discriminator": [
        147,
        60,
        146,
        174,
        124,
        242,
        211,
        215
      ]
    },
    {
      "name": "blackJackHand",
      "discriminator": [
        37,
        121,
        194,
        244,
        217,
        17,
        5,
        254
      ]
    },
    {
      "name": "deck",
      "discriminator": [
        192,
        215,
        78,
        133,
        216,
        161,
        59,
        154
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "tooSmall",
      "msg": "Too Small"
    },
    {
      "code": 6002,
      "name": "tooBig",
      "msg": "Too Big"
    }
  ],
  "types": [
    {
      "name": "blackJack",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "activeHands",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "blackJackHand",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blackjack",
            "type": "pubkey"
          },
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "currentBet",
            "type": "u64"
          },
          {
            "name": "playerCard1",
            "type": "u8"
          },
          {
            "name": "playerCard2",
            "type": "u8"
          },
          {
            "name": "playerCard3",
            "type": "u8"
          },
          {
            "name": "playerCard4",
            "type": "u8"
          },
          {
            "name": "playerCard5",
            "type": "u8"
          },
          {
            "name": "playerCard6",
            "type": "u8"
          },
          {
            "name": "playerCard7",
            "type": "u8"
          },
          {
            "name": "playerCard8",
            "type": "u8"
          },
          {
            "name": "playerCard9",
            "type": "u8"
          },
          {
            "name": "playerCard10",
            "type": "u8"
          },
          {
            "name": "dealerCard1",
            "type": "u8"
          },
          {
            "name": "dealerCard2",
            "type": "u8"
          },
          {
            "name": "dealerCard3",
            "type": "u8"
          },
          {
            "name": "dealerCard4",
            "type": "u8"
          },
          {
            "name": "dealerCard5",
            "type": "u8"
          },
          {
            "name": "dealerCard6",
            "type": "u8"
          },
          {
            "name": "dealerCard7",
            "type": "u8"
          },
          {
            "name": "dealerCard8",
            "type": "u8"
          },
          {
            "name": "dealerCard9",
            "type": "u8"
          },
          {
            "name": "dealerCard10",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "deck",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cards",
            "type": {
              "array": [
                "u8",
                52
              ]
            }
          },
          {
            "name": "drawn",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
