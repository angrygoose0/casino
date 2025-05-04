/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/roulette.json`.
 */
export type Roulette = {
  "address": "AxvxoBUcoLyYAZqEJGzNFxgsfU6QkVYW6bD3TtS7264T",
  "metadata": {
    "name": "roulette",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "bet",
      "discriminator": [
        94,
        203,
        166,
        126,
        20,
        243,
        169,
        82
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wheel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  87,
                  72,
                  69,
                  69,
                  76
                ]
              }
            ]
          }
        },
        {
          "name": "bet",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        },
        {
          "name": "value",
          "type": "u8"
        },
        {
          "name": "form",
          "type": "u8"
        }
      ]
    },
    {
      "name": "callbackSpinWheel",
      "discriminator": [
        208,
        49,
        83,
        83,
        125,
        95,
        22,
        96
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
          "name": "wheel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  87,
                  72,
                  69,
                  69,
                  76
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
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wheel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  87,
                  72,
                  69,
                  69,
                  76
                ]
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
          "address": "D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos"
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
      "args": []
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
          "address": "So11111111111111111111111111111111111111112"
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
          "address": "D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos"
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
      "name": "initWheel",
      "discriminator": [
        155,
        207,
        45,
        54,
        133,
        141,
        242,
        167
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wheel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  87,
                  72,
                  69,
                  69,
                  76
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
      "name": "spinWheel",
      "discriminator": [
        25,
        214,
        214,
        83,
        131,
        150,
        190,
        91
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wheel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  87,
                  72,
                  69,
                  69,
                  76
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
      "name": "bet",
      "discriminator": [
        147,
        23,
        35,
        59,
        15,
        75,
        155,
        32
      ]
    },
    {
      "name": "wheel",
      "discriminator": [
        196,
        41,
        11,
        47,
        123,
        180,
        10,
        219
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    }
  ],
  "types": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "betAmount",
            "type": "u64"
          },
          {
            "name": "value",
            "type": "u8"
          },
          {
            "name": "form",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "wheel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "spinHistory",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "nextSpinTime",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
