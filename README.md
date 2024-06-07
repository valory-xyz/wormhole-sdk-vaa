Wormhole SDK VAA
-------

VAA management based on the [connect-sdk](https://github.com/wormhole-foundation/connect-sdk)

# Setup

```sh
yarn
```

This installs `@wormhole-foundation/connect-sdk` and several platform packages.

# Signing Transactions

Add keys in a `.env` file like:

```
SOL_PRIVATE_KEY="BASE_58_PRIVATE_KEY"
ETH_PRIVATE_KEY="BASE_16_PRIVATE_KEY"
```

# Run to get VAA and create message account

Get a VAA and parse it
```sh
yarn vaa
```

Validate signatures and create a posted account with a message on Solana Mainnet
```sh
yarn msg
```

Validate signatures and create a posted account with a message on Solana Devnet
```sh
yarn dev-msg
```


# Other scripts

Token Transfer

```sh
yarn transfer
```

Native USDC Transfer via CCTP

```sh
yarn cctp
```

Create a wrapped token

```sh
yarn create
```
