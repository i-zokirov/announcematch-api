import { UseInterceptors } from '@nestjs/common';
import { ValidateParamsInterceptor } from 'src/interceptors/validate-params.interceptor';

export default function ValidateRoutParams() {
  return UseInterceptors(new ValidateParamsInterceptor());
}
