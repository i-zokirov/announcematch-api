import { UseInterceptors } from '@nestjs/common';
import {
  ClassContructor,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';

export default function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
