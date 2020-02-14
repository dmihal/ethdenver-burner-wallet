declare module '3box' {
  interface Box {
    getProfile: (account: string) => any;
    openBox: (account: string, provider: any, something: any) => any;
  }

  var box: Box;

  export default box;
}
