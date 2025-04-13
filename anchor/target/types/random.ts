/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/random.json`.
 */
export type Random = {
  "address": "HDxTSvJJ8MABXXo93usZeTxXG2URBPUovNuivjHmuNfq",
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
    }
  ]
};
