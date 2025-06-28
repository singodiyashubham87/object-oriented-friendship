ALTER TABLE "message" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "skills" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "unique_chat_thread" UNIQUE("sender_id","receiver_id");--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "unique_request" UNIQUE("sender_id","receiver_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");