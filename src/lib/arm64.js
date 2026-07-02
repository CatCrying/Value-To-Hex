function toHexBytes(opcode) {
  const bytes = new Uint8Array(4);
  bytes[0] = opcode & 0xFF;
  bytes[1] = (opcode >> 8) & 0xFF;
  bytes[2] = (opcode >> 16) & 0xFF;
  bytes[3] = (opcode >> 24) & 0xFF;
  return Array.from(bytes)
    .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

export function encodeMovZ(register, immediate) {
  const imm16 = immediate & 0xFFFF;
  const rd = register & 0x1F;
  const opcode = 0xD2800000 | (imm16 << 5) | rd;
  return toHexBytes(opcode);
}

export function encodeMovK(register, immediate, shift) {
  const imm16 = immediate & 0xFFFF;
  const rd = register & 0x1F;
  const lsl = (shift & 0x3) << 1;
  const opcode = 0xF2A00000 | (imm16 << 5) | (lsl << 16) | rd;
  return toHexBytes(opcode);
}

export function encodeRet() {
  return 'C0 03 5F D6';
}

export function convertBooleanARM64(value) {
  const numValue = value ? 1 : 0;
  const movzHex = value ? '20 00 80 D2' : '00 00 80 D2';
  const retHex = encodeRet();
  return {
    hex: `${movzHex} ${retHex}`,
    assembly: `MOVZ X0, #${numValue}\nRET`
  };
}

export function convertIntARM64(value) {
  const instructions = [];
  const hexParts = [];
  
  const chunks = [];
  let remaining = Math.abs(value);
  let shift = 0;
  
  while (remaining > 0 || shift === 0) {
    const chunk = remaining & 0xFFFF;
    if (chunk !== 0 || shift === 0) {
      chunks.push({ value: chunk, shift });
    }
    remaining = Math.floor(remaining / 65536);
    shift++;
    if (shift > 3) break;
  }
  
  chunks.forEach((chunk, index) => {
    if (index === 0) {
      const hex = encodeMovZ(0, chunk.value);
      hexParts.push(hex);
      instructions.push(`MOVZ X0, #0x${chunk.value.toString(16).toUpperCase()}`);
    } else {
      const hex = encodeMovK(0, chunk.value, chunk.shift);
      hexParts.push(hex);
      instructions.push(`MOVK X0, #0x${chunk.value.toString(16).toUpperCase()}, LSL #${chunk.shift * 16}`);
    }
  });
  
  hexParts.push(encodeRet());
  instructions.push('RET');
  
  return {
    hex: hexParts.join(' '),
    assembly: instructions.join('\n')
  };
}

export function convertFloatARM64(value) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, false);
  
  const bytes = [];
  for (let i = 0; i < 8; i++) {
    bytes.push(view.getUint8(i).toString(16).toUpperCase().padStart(2, '0'));
  }
  
  const floatHex = bytes.join(' ');
  return {
    hex: floatHex,
    assembly: `; Float value: ${value}\n; Hex representation: ${floatHex}`
  };
}
