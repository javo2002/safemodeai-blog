-- Seed Posts
insert into public.posts (title, content, category, featured, image, published, sources, created_at)
values
  (
    'The Rise of AI-Powered Cyber Threats',
    'The landscape of cybersecurity is undergoing a seismic shift, largely driven by the rapid advancements in Artificial Intelligence. While AI offers powerful tools for defense, it simultaneously equips adversaries with sophisticated capabilities, creating a complex, ever-evolving battlefield.\n\nAI-powered attacks are becoming increasingly common and harder to detect. For instance, generative AI can create highly convincing phishing emails or deepfake videos for social engineering campaigns that bypass traditional human scrutiny. Machine learning algorithms can be trained to identify vulnerabilities in systems at an unprecedented scale and speed, or to adapt malware to evade existing security measures.\n\nOn the defensive side, AI is crucial for analyzing vast amounts of threat data to identify patterns and anomalies that might indicate an attack. AI-driven Security Orchestration, Automation and Response (SOAR) platforms can automate routine security tasks, allowing human analysts to focus on more complex threats.\n\nThe challenge lies in the "cat and mouse" game: as defensive AI gets smarter, so does offensive AI. This necessitates continuous innovation, robust ethical guidelines for AI development in security, and a proactive approach to threat hunting and intelligence sharing.',
    'CYBERSECURITY',
    true,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[
      'https://www.csoonline.com/article/573097/how-ai-is-transforming-cybersecurity.html',
      'Doe, J. (2023). AI in Cyber Attacks. Tech Journal, 45(2), 123-145.',
      'https://www.nist.gov/artificial-intelligence'
    ],
    now() - interval '2 days'
  ),
  (
    'Ethical AI: Navigating the Moral Landscape',
    '', -- Empty content, will show "Coming soon..."
    'AI ETHICS',
    true,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[]::text[],
    now() - interval '1 day'
  ),
  (
    'Machine Learning in Threat Detection',
    '',
    'THREAT ANALYSIS',
    true,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[]::text[],
    now()
  ),
  (
    'The Future of Digital Privacy in the AI Era',
    '',
    'PRIVACY',
    true,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[]::text[],
    now() + interval '1 day' -- Example of a future-dated post if needed for sorting logic
  ),
  (
    'Advanced Persistent Threats (APTs) and AI',
    '',
    'CYBERSECURITY',
    false,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[]::text[],
    now() - interval '3 days'
  ),
  (
    'Bias Mitigation in AI Models',
    '',
    'AI ETHICS',
    false,
    '/placeholder.svg?height=450&width=800',
    true,
    ARRAY[]::text[],
    now() - interval '4 days'
  );

-- Seed a subscriber for testing
insert into public.subscribers (email) values ('test.subscriber@example.com');
