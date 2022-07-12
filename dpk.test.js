const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it('no event provided', () => {
    expect(deterministicPartitionKey()).toBe("0");
  });

  it('without partition key', () => {
    expect(deterministicPartitionKey({})).toBe("c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862");
  });

  it('with partition key as string', () => {
    expect(deterministicPartitionKey({
      partitionKey: "1"
    })).toBe("1");
  })

  it('with partition key as number', () => {
    expect(deterministicPartitionKey({
      partitionKey: 1
    })).toBe("1");
  }) 

  it('with partition key as object', () => {
    expect(deterministicPartitionKey({
      partitionKey: {}
    })).toBe("{}");
  })

  it('with partition key length near max size', () => {
    expect(deterministicPartitionKey({
      partitionKey: '1'.repeat(256)
    })).toBe('1'.repeat(256));
  })

  it('with partition key larger than max size', () => {
    expect(deterministicPartitionKey({
      partitionKey: '1'.repeat(257)
    })).toBe("3f2e417dd3287bb9d5a0e47a8a25191210abdd7739d882cea800f3180dc91508c047c737c51abad48d4d4f2469776294e2b4d9de0af65bffb147d7655ff49fa8");
  })

  it('with partition key as empty string', () => {
    expect(deterministicPartitionKey({
      partitionKey: ""
    })).toBe("b7478342a465088fc33d43a64cd370737e5a3bf6749ca62c1d6db341beb987326b4df3a9f54f67a2f0ee915d4216af2f382fda14dd58dc67794f745e92d7a7f6");
  })
});
