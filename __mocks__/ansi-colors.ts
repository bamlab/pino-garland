/* eslint-disable @typescript-eslint/no-explicit-any */

function mockRecursively(target: any): string {
  return new Proxy(target, {
    get: (_target: object, _name: string) => {
      const mock = jest.fn().mockImplementation((str) => str);
      return mockRecursively(mock);
    },
  }) as any;
}

export default mockRecursively({});
