import { SetMetadata } from '@nestjs/common';
import { USER_OWNER_KEY } from 'src/constants/key.decorators';

export const IsUserOwner = () => SetMetadata(USER_OWNER_KEY, true);
