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

export function encodeMov(register, immediate) {
  const imm8 = immediate & 0xFF;
  const rd = register & 0xF;
  const opcode = 0xE3A00000 | (rd << 12) | imm8;
  return toHexBytes(opcode);
}

export function encodeBxLr() {
  return '1E FF 2F E1';
}

export function convertBooleanARM32(value) {
  const numValue = value ? 1 : 0;
  const movHex = encodeMov(0, numValue);
  const bxHex = encodeBxLr();
  return {
    hex: `${movHex} ${bxHex}`,
    assembly: `MOV R0, #${numValue}\nBX LR`
  };
}

export function convertIntARM32(value) {
  const hex = encodeMov(0, value & 0xFF);
  const bx = encodeBxLr();
  return {
    hex: `${hex} ${bx}`,
    assembly: `MOV R0, #${value}\nBX LR`
  };
}

export function convertFloatARM32(value) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false);
  
  const bytes = [];
  for (let i = 0; i < 4; i++) {
    bytes.push(view.getUint8(i).toString(16).toUpperCase().padStart(2, '0'));
  }
  
  return {
    hex: bytes.join(' '),
    assembly: `; Float: ${value}`
  };
}
