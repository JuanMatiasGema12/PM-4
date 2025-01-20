import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { loggerGlobal } from "../middlewares/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(loggerGlobal).forRoutes('users');
    }
}
