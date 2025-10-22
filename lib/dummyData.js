
// Dummy data for articles with AI-generated placeholder images
const dummyArticles = [
  {
    id: "1",
    title: "Nvidia's Blackwell GPU: A New Era for AI",
    description: "Nvidia's new Blackwell GPU architecture is set to redefine the boundaries of AI and high-performance computing.",
    content: "Nvidia has once again raised the bar with its latest Blackwell GPU architecture. This new platform promises to deliver unprecedented performance for AI training and inference, enabling the development of even larger and more complex models. With its advanced features and improved efficiency, Blackwell is poised to become the new standard for data centers and AI researchers worldwide. The architecture's innovative design is expected to accelerate breakthroughs in natural language processing, computer vision, and other AI-driven fields.",
    image: "https://techcrunch.com/wp-content/uploads/2024/11/GettyImages-2183848501.jpg?w=1024",
    date: "2025-10-18",
    category: "AI",
    views: 3500
  },
  {
    id: "2",
    title: "Google's Gemini: The Next Generation of Multimodal AI",
    description: "An in-depth look at Google's Gemini, a powerful multimodal AI model that is changing the way we interact with technology.",
    content: "Google's Gemini is a groundbreaking multimodal AI model that can understand and process information from multiple sources, including text, images, and audio. This versatility opens up a wide range of new applications, from more natural and intuitive search experiences to advanced creative tools. Gemini's ability to reason across different data types makes it one of the most powerful and flexible AI models ever created. As Google continues to integrate Gemini into its products, we can expect to see a new wave of innovation in the AI landscape.",
    image: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/IO24_WhatsInAName_SocialShare_S96SOzG.width-1300.png",
    date: "2025-10-17",
    category: "AI",
    views: 2800
  },
  {
    id: "3",
    title: "Anthropic's Claude 3: A New Contender in the LLM Race",
    description: "Anthropic's Claude 3 is making waves in the world of large language models, offering a unique focus on safety and ethical considerations.",
    content: "Anthropic's Claude 3 has emerged as a serious contender in the competitive landscape of large language models. With its emphasis on safety and constitutional AI, Claude 3 offers a compelling alternative to other models on the market. The model's ability to engage in helpful, harmless, and honest conversations has made it a popular choice for a wide range of applications. As the demand for ethical AI continues to grow, Anthropic's approach could set a new standard for the industry.",
    image: "https://miro.medium.com/1*7P65v_3lCUd-sJynxQt_3Q.png",
    date: "2025-10-16",
    category: "AI",
    views: 2100
  },
  {
    id: "4",
    title: "GitHub Copilot: How AI is Transforming Software Development",
    description: "A look at how GitHub Copilot and other AI-powered coding assistants are changing the game for software developers.",
    content: "GitHub Copilot has revolutionized the way developers write code. By providing intelligent code suggestions and autocompletions, Copilot helps developers work faster and more efficiently. This AI-powered coding assistant is just one example of how artificial intelligence is transforming the software development lifecycle. From automated testing to intelligent bug detection, AI is making it easier than ever to build high-quality software. As these tools continue to evolve, they will become an indispensable part of every developer's workflow.",
    image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-15",
    category: "AI",
    views: 4200
  },
  {
    id: "5",
    title: "The Rise of Generative AI: A Creative Revolution",
    description: "Generative AI is unlocking new possibilities for creativity, from art and music to writing and design.",
    content: "Generative AI is a rapidly growing field of artificial intelligence that is transforming the creative landscape. By learning from vast amounts of data, generative models can create new and original content, including images, music, and text. This technology is empowering artists, musicians, and writers to explore new forms of expression and push the boundaries of their craft. As generative AI becomes more accessible, it has the potential to democratize creativity and unlock new opportunities for innovation.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-14",
    category: "AI",
    views: 1800
  },
  {
    id: "6",
    title: "AI in Finance: The Future of Trading and Investment",
    description: "How artificial intelligence is being used to analyze financial markets, predict trends, and make investment decisions.",
    content: "Artificial intelligence is transforming the financial industry, from high-frequency trading to personalized wealth management. AI-powered algorithms can analyze vast amounts of financial data to identify patterns and predict market trends with a high degree of accuracy. This technology is enabling investment firms to make more informed decisions and manage risk more effectively. As AI continues to mature, it will play an increasingly important role in the future of finance.",
    image: "https://images.unsplash.com/photo-1554260570-e9689a3418b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-13",
    category: "AI",
    views: 1500
  },
  {
    id: "7",
    title: "The Ethics of AI: Navigating the Moral Landscape",
    description: "A deep dive into the ethical dilemmas posed by artificial intelligence and how we can build a more responsible future.",
    content: "The rapid advancement of artificial intelligence has brought a host of ethical challenges to the forefront. From algorithmic bias and data privacy to the potential for autonomous weapons, the moral landscape of AI is complex and fraught with peril. This article explores the key ethical considerations in AI development and deployment, and discusses the frameworks and regulations that are being proposed to ensure that AI is used for the benefit of humanity.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSfZMluAtfR7RP7xncesGBdWYX3Gel2DXIpQ&s",
    date: "2025-10-12",
    category: "AI",
    views: 1900
  },

  {
    id: "9",
    title: "The Future of Transportation: AI-Powered Autonomous Vehicles",
    description: "A look at the latest advancements in autonomous vehicle technology and how it will change the way we travel.",
    content: "Autonomous vehicles are no longer the stuff of science fiction. Thanks to rapid advancements in artificial intelligence, self-driving cars, trucks, and drones are becoming a reality. This technology has the potential to revolutionize transportation, making it safer, more efficient, and more accessible. This article explores the latest advancements in autonomous vehicle technology and discusses the challenges and opportunities that lie ahead.",
    image: "https://images.unsplash.com/photo-1581399909946-212344b3cf59?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QUktUG93ZXJlZCUyMEF1dG9ub21vdXMlMjBWZWhpY2xlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
    date: "2025-10-10",
    category: "AI",
    views: 2500
  },
  {
    id: "10",
    title: "AI and the Future of Art: A New Creative Frontier",
    description: "How AI is being used to create new forms of art and what it means for the future of creativity.",
    content: "Artificial intelligence is not just a tool for science and technology; it is also a powerful new medium for artistic expression. AI-powered algorithms can generate stunning images, compose beautiful music, and write compelling stories. This technology is blurring the lines between human and machine creativity and opening up new frontiers for artistic exploration. This article explores the exciting new world of AI art and discusses the implications for the future of creativity.",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-09",
    category: "AI",
    views: 1600
  },
  {
    id: "11",
    title: "The Power of Natural Language Processing: How AI Understands Human Language",
    description: "A deep dive into the technology that allows machines to understand and respond to human language.",
    content: "Natural Language Processing (NLP) is a branch of artificial intelligence that deals with the interaction between computers and humans using natural language. NLP is the technology that powers everything from virtual assistants like Siri and Alexa to machine translation services like Google Translate. This article provides a deep dive into the world of NLP, explaining how it works and exploring its many applications.",
    image: "https://images.unsplash.com/photo-1650844228078-6c3cb119abcd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFRoZSUyMFBvd2VyJTIwb2YlMjBOYXR1cmFsJTIwTGFuZ3VhZ2UlMjBQcm9jZXNzaW5nJTNBJTIwSG93JTIwQUklMjBVbmRlcnN0YW5kcyUyMEh1bWFuJTIwTGFuZ3VhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    date: "2025-10-08",
    category: "AI",
    views: 2200
  },
  {
    id: "12",
    title: "AI in Education: Personalizing the Learning Experience",
    description: "How AI is being used to create personalized learning experiences for students of all ages.",
    content: "Artificial intelligence is poised to revolutionize the education sector, offering new opportunities to personalize the learning experience for every student. AI-powered adaptive learning platforms can tailor the curriculum to each student's individual needs and learning style, while intelligent tutoring systems can provide one-on-one support and feedback. This technology has the potential to make education more engaging, effective, and accessible to all.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-07",
    category: "AI",
    views: 1300
  },
  {
    id: "13",
    title: "The Future of Gaming: How AI is Creating More Immersive and Realistic Worlds",
    description: "A look at how AI is being used to create more intelligent NPCs, realistic graphics, and dynamic storylines in video games.",
    content: "Artificial intelligence is transforming the gaming industry, enabling developers to create more immersive and realistic gaming experiences than ever before. AI-powered non-player characters (NPCs) can now interact with players in more intelligent and believable ways, while procedural content generation can create vast and dynamic game worlds. This technology is pushing the boundaries of what is possible in gaming and creating new opportunities for interactive storytelling.",
    image: "https://images.unsplash.com/photo-1607983014687-c75af0417134?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QUktUG93ZXJlZCUyMGdhbWluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
    date: "2025-10-06",
    category: "AI",
    views: 3100
  },
  {
    id: "14",
    title: "AI and Cybersecurity: A Double-Edged Sword",
    description: "How AI is being used to both enhance and threaten cybersecurity.",
    content: "Artificial intelligence is a double-edged sword when it comes to cybersecurity. On the one hand, AI-powered security systems can detect and respond to threats more quickly and effectively than ever before. On the other hand, AI can also be used by malicious actors to create more sophisticated and evasive cyberattacks. This article explores the complex relationship between AI and cybersecurity and discusses the challenges and opportunities that lie ahead.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAjOIQ7TwGzb7OXPQCjXshoO2B6fZH6SqBNg&s",
    date: "2025-10-05",
    category: "AI",
    views: 1700
  },
  {
    id: "15",
    title: "The Rise of the AI-Powered Virtual Assistant",
    description: "A look at the latest advancements in virtual assistant technology and how it is changing the way we live and work.",
    content: "Virtual assistants like Siri, Alexa, and Google Assistant have become an integral part of our daily lives. These AI-powered assistants can help us with everything from setting reminders and playing music to controlling our smart homes and answering our questions. This article explores the latest advancements in virtual assistant technology and discusses the impact it is having on our lives.",
    image: "https://images.unsplash.com/photo-1740174459718-fdcc63ee3b4f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QUktUG93ZXJlZCUyMFZpcnR1YWwlMjBBc3Npc3RhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    date: "2025-10-04",
    category: "AI",
    views: 2000
  },
  {
    id: "16",
    title: "AI and the Future of Healthcare: A Revolution in Medicine",
    description: "How AI is being used to diagnose diseases, develop new drugs, and personalize treatment plans.",
    content: "Artificial intelligence is revolutionizing the healthcare industry, offering new hope for the diagnosis, treatment, and prevention of disease. AI-powered diagnostic tools can detect diseases like cancer and Alzheimer's with a high degree of accuracy, while machine learning algorithms can help researchers to develop new drugs and therapies more quickly and efficiently. This technology has the potential to transform healthcare as we know it, making it more personalized, predictive, and participatory.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-10-03",
    category: "AI",
    views: 2800
  },

  {
    id: "18",
    title: "AI and the Future of Democracy: A Double-Edged Sword",
    description: "How AI is being used to both enhance and threaten democracy.",
    content: "Artificial intelligence is a double-edged sword when it comes to democracy. On the one hand, AI can be used to promote civic engagement, increase government transparency, and combat misinformation. On the other hand, AI can also be used to spread propaganda, manipulate public opinion, and undermine democratic institutions. This article explores the complex relationship between AI and democracy and discusses the challenges and opportunities that lie ahead.",
    image: "https://images.unsplash.com/photo-1737644467636-6b0053476bb2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1372",
    date: "2025-10-01",
    category: "AI",
    views: 1200
  },
  {
    id: "19",
    title: "The Future of Work: How to Prepare for the AI Revolution",
    description: "A guide to the skills and knowledge you'll need to thrive in the age of AI.",
    content: "The rise of artificial intelligence is transforming the job market, creating new opportunities and challenges for workers in every industry. To thrive in the age of AI, it is essential to develop the skills and knowledge that will be in high demand. This article provides a guide to the future of work, outlining the key skills and competencies you'll need to succeed in the AI-powered economy of the 21st century.",
    image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "2025-09-30",
    category: "AI",
    views: 2100
  },
  {
    id: "20",
    title: "AI for Good: How to Use Artificial Intelligence to Make a Positive Impact on the World",
    description: "A look at how AI is being used to address some of the world's most pressing challenges, from climate change to global health.",
    content: "Artificial intelligence is not just a tool for making money; it is also a powerful force for good in the world. AI is being used to address some of the world's most pressing challenges, from climate change and global health to poverty and inequality. This article explores the growing movement of AI for Good and highlights some of the inspiring ways that AI is being used to make a positive impact on the world.",
    image: "https://images.unsplash.com/photo-1744230673231-865d54a0aba4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMGluJTIwYWdyaWN1bHRydXJlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    date: "2025-09-29",
    category: "AI",
    views: 1800
  },
  {
    id: "21",
    title: "The Future of AI: A Conversation with a Leading Researcher",
    description: "An exclusive interview with one of the world's leading AI researchers on the future of artificial intelligence.",
    content: "In this exclusive interview, we sit down with one of the world's leading AI researchers to discuss the future of artificial intelligence. We talk about the latest breakthroughs in AI, the ethical challenges that lie ahead, and the potential for AI to transform our world. This is a must-read for anyone who is interested in the future of technology and the future of humanity.",
    image: "https://images.unsplash.com/photo-1646583288948-24548aedffd8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    date: "2025-09-28",
    category: "AI",
    views: 3200
  }
];

export default dummyArticles;

