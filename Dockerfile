# আমরা সরাসরি Bun এর ইমেজ ব্যবহার করছি
FROM oven/bun:latest

# অ্যাপ ডিরেক্টরি সেট করা
WORKDIR /usr/src/app

# ১. শুধুমাত্র প্যাকেজ ফাইলগুলো কপি করা (ক্যাশিং সুবিধার জন্য)
COPY package.json bun.lock ./

# ২. সব ডিপেন্ডেন্সি ইনস্টল করা
RUN bun install

# ৩. প্রিজমা ফাইল কপি করা এবং ক্লায়েন্ট জেনারেট করা
COPY prisma ./prisma/
RUN bunx prisma generate

# ৪. আপনার পুরো সোর্স কোড কপি করা
COPY . .

# আপনার অ্যাপ যদি ৩০০০ পোর্টে চলে
EXPOSE 3000

# ৫. সরাসরি টাইপস্ক্রিপ্ট ফাইল রান করা (বিল্ড করার প্রয়োজন নেই)
CMD ["bun", "run", "src/server.ts"]