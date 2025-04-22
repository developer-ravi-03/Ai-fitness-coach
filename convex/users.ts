import {mutation} from "./_generated/server"
import {v} from "convex/values"

//this function is for creating the user in the database
export const snycUser = mutation({
  args:{
    name:v.string(),
    email:v.string(),
    clerkId:v.string(),
    image:v.optional(v.string()),

  },
  handler: async(ctx, args)=>{
    const existingUser = await ctx.db
    .query("users")
    .filter((q) =>
      q.eq(q.field("clerkId"), args.clerkId)
    )
    .first();

    if(existingUser) return;

    return await ctx.db.insert("users", args)
  },
});

//this function is for updating the user data in the database
export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!existingUser) return;

    return await ctx.db.patch(existingUser._id, args);
  },
});