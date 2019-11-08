declare module '@linkdrop/commons/get-hash-variables' {
  const getHashVariables: () => any;
  export default getHashVariables;
}

declare module '@linkdrop/sdk/src/index' {
  export default class LinkdropSDK {
    constructor(props: any);
  }
}
