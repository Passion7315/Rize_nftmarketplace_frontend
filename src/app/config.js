const devnet = true;
export const config = {
    socketUrl: "http://192.168.123.67:5000", 
    baseUrl: "http://192.168.123.67:5000/api/",
    API_URL: "http://192.168.123.67:5000/",
    RPC_URL: devnet ? 'https://s-0.devnet-1.coreum.dev/' : 'https://rpc-test.coreum.hexskrt.net/',
    REST_URL: devnet ? 'https://s-0.devnet-1.coreum.dev/rest/' : 'https://api-test.coreum.hexskrt.net/',
    DATA_LAYER: devnet ? '' : '',
    FAUCET_URL: '',
    CHAIN_ID: devnet ? 'coreum-devnet-1' : 'coreum-testnet-1"',
    CHAIN_NAME: devnet ? 'Coreum Devnet 1' : 'Coreum Testnet 1',
    COIN_DENOM: devnet? 'DCORE' : 'testcore',
    COIN_MINIMAL_DENOM: devnet ? 'ducore' : 'utestcore',
    COIN_TYPE: devnet ? 990 : 990,
    COIN_DECIMALS: 6,
    COIN_GECKOID: devnet ? "coreum" : 'unknown',
    PREFIX: devnet ? 'devcore' : 'testcore',
    AVG_GAS_STEP: 0.005,
}

export const chainConfig = {
    chainId: config.CHAIN_ID,
    chainName: config.CHAIN_NAME,
    rpc: config.RPC_URL,
    rest: config.REST_URL,
    stakeCurrency: {
        coinDenom: config.COIN_DENOM,
        coinMinimalDenom: config.COIN_MINIMAL_DENOM,
        coinDecimals: config.COIN_DECIMALS,
        coinGeckoId: config.COIN_GECKOID
    },
    bip44: {
        coinType: config.COIN_TYPE,
    },
    bech32Config: {
        bech32PrefixAccAddr: `${config.PREFIX}`,
        bech32PrefixAccPub: `${config.PREFIX}pub`,
        bech32PrefixValAddr: `${config.PREFIX}valoper`,
        bech32PrefixValPub: `${config.PREFIX}valoperpub`,
        bech32PrefixConsAddr: `${config.PREFIX}valcons`,
        bech32PrefixConsPub: `${config.PREFIX}valconspub`,
    },
    currencies: [
        {
            coinDenom: config.COIN_DENOM,
            coinMinimalDenom: config.COIN_MINIMAL_DENOM,
            coinDecimals: config.COIN_DECIMALS,
            coinGeckoId: config.COIN_GECKOID
        },
    ],
    feeCurrencies: [
        {
            coinDenom: config.COIN_DENOM,
            coinMinimalDenom: config.COIN_MINIMAL_DENOM,
            coinDecimals: config.COIN_DECIMALS,
            coinGeckoId: config.COIN_GECKOID,
            gasPriceStep: {
                low: 0.0625,
                average: 0.1,
                high: 62.5,
            },
        },
    ],
    coinType: config.COIN_TYPE,
    beta: true
}


export const CATEGORIES = [
    { value: 1, text: "Arts" },
    { value: 2, text: "Games" },
    { value: 3, text: "Sports" },
    { value: 4, text: "Photography" }
  ];

  