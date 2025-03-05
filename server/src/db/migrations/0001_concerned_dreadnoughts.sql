CREATE TABLE "bookmark" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bookmarker_id" uuid NOT NULL,
	"bookmarked_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"last_message" text,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"content_type" "message_type" DEFAULT 'text' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"status" "request_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"profile_pic" text NOT NULL,
	"bio" text,
	"skills" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "bookmarks" CASCADE;--> statement-breakpoint
DROP TABLE "chats" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
DROP TABLE "requests" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_bookmarker_id_user_id_fk" FOREIGN KEY ("bookmarker_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_bookmarked_id_user_id_fk" FOREIGN KEY ("bookmarked_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;