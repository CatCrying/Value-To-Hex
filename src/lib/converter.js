import { convertBooleanARM64, convertIntARM64, convertFloatARM64 } from './arm64.js';
import { convertBooleanARM32, convertIntARM32, convertFloatARM32 } from './arm32.js';

export function convertValue(architecture, type, value) {
  const isARM64 = architecture === 'ARM64';
  
  if (type === 'Boolean') {
    const boolValue = value.toLowerCase() === 'true';
    return isARM64 ? convertBooleanARM64(boolValue) : convertBooleanARM32(boolValue);
  }
  
  if (type === 'INT') {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) throw new Error('Invalid integer value');
    return isARM64 ? convertIntARM64(intValue) : convertIntARM32(intValue);
  }
  
  if (type === 'Float') {
    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) throw new Error('Invalid float value');
    return isARM64 ? convertFloatARM64(floatValue) : convertFloatARM32(floatValue);
  }
  
  throw new Error(`Unknown type: ${type}`);
}
