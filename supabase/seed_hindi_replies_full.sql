-- =========================================================================
-- VANI: Full Hindi reply translations — all replies by UUID
-- Run AFTER seed_hindi_phrases_full.sql
-- Idempotent: safe to re-run (uses ON CONFLICT DO UPDATE)
-- =========================================================================

insert into public.reply_translations
  (reply_id, language_code, phonetic_text, native_text)
values
  -- ── Greetings: Hi ─────────────────────────────────────────────────────
  ('ffec8ac1-e5ab-4f14-ba9e-1c7a64fe3083','hi','Haay','हाय'),
  ('304c166d-79fa-4f42-b70b-b65fadd3360c','hi','Hello','हेलो'),
  ('d06e0ea8-ef64-4d0c-8405-495433c4193d','hi','Hey','हे'),

  -- ── Greetings: How are you? ───────────────────────────────────────────
  ('525b9655-ab8a-463f-b711-fefba662c439','hi','Main theek hoon','मैं ठीक हूं'),
  ('69d6eae7-5ed1-4a6c-b3de-01ecd01cc136','hi','Main achha hoon','मैं अच्छा हूं'),
  ('f0abbebf-bd60-4c8e-a37d-2f68e8bbc5fb','hi','Main theek hoon','मैं ठीक हूं'),

  -- ── Greetings: I am fine ──────────────────────────────────────────────
  ('65af9ebf-bd09-4b68-bde4-a4f625f8507d','hi','Achha','अच्छा'),
  ('3884c5ef-f48d-441d-ae43-083414e8517f','hi','Achha','अच्छा'),
  ('dbe927c5-6e0e-4f6b-95f4-50be732874d7','hi','Bahut achha','बहुत अच्छा'),

  -- ── Greetings: Thank you ──────────────────────────────────────────────
  ('58dfaf4b-02b1-453b-8433-83fa85099cc2','hi','Swaagat hai','स्वागत है'),
  ('d1a81700-92d3-4a3d-8d6f-deb9dcd94f43','hi','Koi baat nahi','कोई बात नहीं'),
  ('b96b77b1-0a81-4b5b-b1d8-ff5e4d64eee1','hi','Theek hai','ठीक है'),

  -- ── Greetings: My name is ─────────────────────────────────────────────
  ('aae29c0b-26e5-4109-98b3-ef6e633fad6e','hi','Mera naam [Name] hai','मेरा नाम [Name] है'),
  ('1e3a8067-c8c4-4496-9add-a4b8ccefd595','hi','Achha naam hai','अच्छा नाम है'),
  ('f779784f-6595-4d91-b9a5-75a8f97b2f41','hi','Aapase milakar achha laga','आपसे मिलकर अच्छा लगा'),

  -- ── Greetings: I am new to this city ─────────────────────────────────
  ('5e491d90-6a27-459e-9284-f2ee476ee197','hi','Achha','अच्छा'),
  ('517b14b1-375c-4cd0-8beb-1f14e1276f60','hi','Swaagat hai','स्वागत है'),
  ('811b56f3-fae5-4c37-82b6-d20331235edf','hi','Kaun si jagah?','कौन सी जगह?'),

  -- ── Greetings: I don't know Kannada ──────────────────────────────────
  ('91ec6b5f-7de7-4d91-a31a-7cdf588de7cf','hi','Koi baat nahi','कोई बात नहीं'),
  ('4b1be5c3-dac3-4ed7-89c7-ae709e6adf80','hi','Main dheere bolunga','मैं धीरे बोलूंगा'),
  ('c2e1b86d-5f23-4232-9917-61b21e82d1fd','hi','Kya aap Hindi jaante hain?','क्या आप हिंदी जानते हैं?'),

  -- ── Greetings: Where do you work? ────────────────────────────────────
  ('ea71eb4b-e9c4-4d6e-b952-b95b16cc6ecf','hi','Main yahan kaam karta hoon','मैं यहां काम करता हूं'),
  ('7bd60220-3eb7-4bbc-8660-b418621aeda0','hi','Main office mein kaam karta hoon','मैं ऑफिस में काम करता हूं'),
  ('c4487d55-9a37-47f0-8796-7d83b40c1dcd','hi','Main dukaan mein kaam karta hoon','मैं दुकान में काम करता हूं'),

  -- ── Greetings: Please speak slowly ───────────────────────────────────
  ('e25623a7-c6d0-4494-ab63-47e0c589b070','hi','Theek hai','ठीक है'),
  ('db6099f4-1f73-4edb-9583-22dfe5ae3f47','hi','Main dheere bolunga','मैं धीरे बोलूंगा'),
  ('49167e19-d5f7-4c9e-bc0a-00e9ffa1d35b','hi','Bataiye','बताइए'),

  -- ── Greetings: Sorry ─────────────────────────────────────────────────
  ('170be2ca-056e-4ac5-9816-d77684f813f9','hi','Koi baat nahi','कोई बात नहीं'),
  ('61dd4d67-d0a1-4e1e-b7eb-9fb25741b167','hi','Koi baat nahi','कोई बात नहीं'),
  ('fa9f0470-87ba-4798-af7f-86bf8efecc20','hi','Theek hai','ठीक है'),

  -- ── Food: What is available? ─────────────────────────────────────────
  ('02bc1bea-151c-4ef1-adf7-c4a3446b48c0','hi','Idli upalabdh hai','इडली उपलब्ध है'),
  ('81849886-b36b-4575-bce8-f819e1eca571','hi','Khaana upalabdh hai','खाना उपलब्ध है'),
  ('f2ab1a9a-ba48-4d9b-8b56-ca7985b92115','hi','Dosa upalabdh hai','डोसा उपलब्ध है'),

  -- ── Food: I want food ────────────────────────────────────────────────
  ('735c60cf-8101-4cc3-819a-923e70c1dc09','hi','Aap kya chaahte hain?','आप क्या चाहते हैं?'),
  ('930d67cb-be0e-4c91-a34e-7ba09083a0a6','hi','Khaana upalabdh hai','खाना उपलब्ध है'),
  ('a8d240f3-2a64-4db3-8c2e-3828eb39f328','hi','Rukiye','रुकिए'),

  -- ── Food: I want water ───────────────────────────────────────────────
  ('ab2f39de-019b-4797-bc8c-6c194d05aeac','hi','Abhi deta hoon','अभी देता हूं'),
  ('9c3c9dc2-eb9c-4c5d-bc25-f5235680bf2c','hi','Upalabdh hai','उपलब्ध है'),
  ('274136fa-0499-47b8-a8dd-040e2d0d43fb','hi','Rukiye','रुकिए'),

  -- ── Food: I want one plate ───────────────────────────────────────────
  ('f905cab8-f1af-40da-ab5c-692bf0582ddf','hi','Kaun sa item?','कौन सा आइटम?'),
  ('3a796928-0fcb-4943-ad6d-b2b6afd1d3ea','hi','Theek hai','ठीक है'),
  ('345f146e-c190-4b2d-ac80-07e0d51e8984','hi','Abhi aa raha hoon','अभी आ रहा हूं'),

  -- ── Food: Make it less spicy ─────────────────────────────────────────
  ('501d6386-cb26-4c4e-8f16-92056a3fd038','hi','Theek hai','ठीक है'),
  ('3be8c450-4f01-4e3e-90e1-93ae9cebb316','hi','Thoda masaledar theek hai?','थोड़ा मसालेदार ठीक है?'),
  ('dc42c547-c346-438e-a7b9-a034316ae9b6','hi','Kam nahi kar sakte','कम नहीं कर सकते'),

  -- ── Food: Do you have [item]? ────────────────────────────────────────
  ('b54da2df-43a5-4b50-8375-41f0872b986f','hi','Haan, upalabdh hai','हां, उपलब्ध है'),
  ('f37b7324-2dc3-495d-ac47-f9c00f187fcc','hi','Upalabdh nahi hai','उपलब्ध नहीं है'),
  ('9212ec97-9047-4b1e-b02e-116007097c9c','hi','Samay lagega','समय लगेगा'),

  -- ── Food: Give me one tea ────────────────────────────────────────────
  ('3f4cdf58-a49a-4ef0-ac88-4bcee0617c6e','hi','Theek hai','ठीक है'),
  ('fb9cc7b5-edc8-437d-8023-d7ea896e857d','hi','Abhi aa raha hoon','अभी आ रहा हूं'),
  ('eb3065ee-5a75-4f4e-9822-d3229726c667','hi','Rukiye','रुकिए'),

  -- ── Food: Give me one coffee ─────────────────────────────────────────
  ('e6d5b08d-1eff-4047-a60d-babe02399252','hi','Theek hai','ठीक है'),
  ('d07bbb8a-2134-4dab-a2bf-8506bf446cd5','hi','Taaza bana raha hoon','ताज़ा बना रहा हूं'),
  ('75be432f-0d7c-47cd-90df-421a25b81c09','hi','Rukiye','रुकिए'),

  -- ── Food: How much is this? (Food) ───────────────────────────────────
  ('6aaf9169-78b6-4160-a0f7-c02a0afb5ce8','hi','50 rupaye','50 रुपये'),
  ('be77fd75-560e-4394-adf5-d48eb2d644e0','hi','80 rupaye','80 रुपये'),
  ('8743c8e2-0388-4a7c-89d6-ea40ef1c3a4f','hi','100 rupaye','100 रुपये'),

  -- ── Food: The food is good ───────────────────────────────────────────
  ('e5f56085-07b5-4d33-a365-f21a852dc8e2','hi','Dhanyavaad','धन्यवाद'),
  ('af60686a-14bf-4a40-9117-747504e3684f','hi','Aur chaahiye?','और चाहिए?'),
  ('2dbb32f1-b537-4273-a006-979d5af5cfd7','hi','Khushi hui','खुशी हुई'),

  -- ── Travel: Where is this place? ─────────────────────────────────────
  ('42702bd6-136b-4ff0-a656-dabafa1a5528','hi','Seedhe jaiye','सीधे जाइए'),
  ('db3531a7-012c-46ec-93df-5d0a6cd71ccb','hi','Baayin taraf hai','बाईं तरफ है'),
  ('e2c38781-25ac-4208-abaf-b71634eb43fa','hi','Daayein taraf hai','दाईं तरफ है'),

  -- ── Travel: I want to go here ────────────────────────────────────────
  ('0819de77-d322-471d-b6f1-456f690a3fe1','hi','Theek hai','ठीक है'),
  ('695e60cf-dcd0-4556-b901-990a150e774a','hi','Baithiye','बैठिए'),
  ('30f7098c-5d49-418a-9b3f-e59dfd1b4014','hi','Abhi chal rahe hain','अभी चल रहे हैं'),

  -- ── Travel: Can you come? ────────────────────────────────────────────
  ('fb80587b-2473-4245-a011-54b9dc991907','hi','Haan, main aaunga','हां, मैं आऊंगा'),
  ('864cde71-dc64-4daa-b145-039a80ad8d5c','hi','5 minute rukiye','5 मिनट रुकिए'),
  ('39599fa3-4823-4bb3-ba46-21e0a461bc2c','hi','Nahi aa sakta','नहीं आ सकता'),

  -- ── Travel: How much is the fare? ────────────────────────────────────
  ('ec6381e9-009d-451c-89dc-401bd9529aa1','hi','100 rupaye','100 रुपये'),
  ('a87f26b6-3a2d-4124-b045-de9d274c23aa','hi','150 rupaye','150 रुपये'),
  ('57a9bc67-81e1-4136-80c4-1c254e7381e3','hi','Meter se','मीटर से'),

  -- ── Travel: Go straight ──────────────────────────────────────────────
  ('072946d1-4aae-41c6-abc3-9d8905bfb5dd','hi','Theek hai','ठीक है'),
  ('d26fc193-ab08-4010-b1f8-7674cd8781a9','hi','Traffic hai','ट्रैफिक है'),
  ('0edbb744-22bd-4d57-b248-67dca19516ab','hi','Ja raha hoon','जा रहा हूं'),

  -- ── Travel: Turn left ────────────────────────────────────────────────
  ('15ddd93d-79bf-42a4-8946-c42f295631b3','hi','Theek hai','ठीक है'),
  ('e3a9af9e-e10c-465d-ae58-3f458cb8d58d','hi','Yahan?','यहां?'),
  ('1e611142-034c-4f03-8dff-666fe9ea1371','hi','Mud raha hoon','मुड़ रहा हूं'),

  -- ── Travel: Turn right ───────────────────────────────────────────────
  ('af64b3b2-8689-4a7f-a868-7a0c1bd0f47b','hi','Theek hai','ठीक है'),
  ('8b479f70-a9ab-42f8-9823-49df899a78b6','hi','Yahan?','यहां?'),
  ('77fb2341-95c1-4327-b9a2-932077403101','hi','Mud raha hoon','मुड़ रहा हूं'),

  -- ── Travel: How far is it? ───────────────────────────────────────────
  ('c08d1cb7-e309-4e20-a214-3682766af33b','hi','2 km hai','2 किमी है'),
  ('734627eb-1961-43dc-bbed-390f9e6248ea','hi','10 minute','10 मिनट'),
  ('bc152de4-29f7-486a-b10d-7516e488b76f','hi','Paas mein hai','पास में है'),

  -- ── Travel: Stop here ────────────────────────────────────────────────
  ('47796a57-a477-4350-a540-976018f48cd9','hi','Theek hai','ठीक है'),
  ('98812167-0c1d-4842-b6f1-7ecdabf90b35','hi','Rok raha hoon','रोक रहा हूं'),
  ('5e400644-330e-41a2-9fd6-7f818ba31114','hi','Yahan?','यहां?'),

  -- ── Travel: Wait here ────────────────────────────────────────────────
  ('4b03361f-a7cd-43b4-8ebd-80157263a233','hi','Theek hai','ठीक है'),
  ('46d33972-94f4-4e95-b0dc-e98f66dab6cb','hi','Kitni der?','कितनी देर?'),
  ('cb874f2a-b410-4952-996f-ba9daca02ecb','hi','2 minute theek hai','2 मिनट ठीक है'),

  -- ── Money: How much is this? (Money) ─────────────────────────────────
  ('4275321c-ed0d-4fe8-9f47-4a7cea0ecf7c','hi','100 rupaye','100 रुपये'),
  ('0098de93-af22-4983-bd18-6766fb55e5d5','hi','Fix daam','फिक्स दाम'),
  ('27d7db96-3c10-49fd-9c26-bf6cc3c8f7e4','hi','Yah bhi dekhiye','यह भी देखिए'),

  -- ── Money: Too expensive ─────────────────────────────────────────────
  ('97fa4c26-6626-4a74-b619-a1d8a9d094d5','hi','Theek hai, kam karta hoon','ठीक है, कम करता हूं'),
  ('1b6a7859-9072-4f1a-a165-5c99323be0d6','hi','Fix daam','फिक्स दाम'),
  ('4cf284c3-a3bf-4a2b-8526-747bc2072405','hi','Discount nahi','डिस्काउंट नहीं'),

  -- ── Money: Please reduce the price ───────────────────────────────────
  ('04c914ea-ba33-4e23-b26d-6fedcc0c1980','hi','Kitna chaahiye?','कितना चाहिए?'),
  ('31c894f1-1eea-4ed9-9596-c373e644bfa3','hi','Theek hai, final daam itna','ठीक है, फाइनल दाम इतना'),
  ('dd21ac9b-3a21-48af-8d19-542de0092daa','hi','Kam nahi ho sakta','कम नहीं हो सकता'),

  -- ── Money: Final price? ──────────────────────────────────────────────
  ('0c03fd03-fea1-4531-abe2-20d0d0c9425f','hi','Yah final hai','यह फाइनल है'),
  ('b21a58a5-e2e2-4e8b-a276-300c61f6fec0','hi','Aakhiri discount diya','आखिरी डिस्काउंट दिया'),
  ('014a0547-89ce-4a42-a4ad-517ccc27a698','hi','Aur kam nahi hoga','और कम नहीं होगा'),

  -- ── Money: Any discount? ─────────────────────────────────────────────
  ('351b2dc9-107d-4b21-b5ed-cd1f55ecd5ad','hi','Haan, thoda discount','हां, थोड़ा डिस्काउंट'),
  ('dc967147-2e10-4f33-94b8-76820a42b17e','hi','Discount nahi','डिस्काउंट नहीं'),
  ('ed746fa5-f39b-4c0d-a858-535749ecb74a','hi','Do item ke liye hi','दो आइटम के लिए ही'),

  -- ── Money: I have only [amount] ──────────────────────────────────────
  ('23c92dee-5af4-4a1e-a268-d6afa1cb05cd','hi','Theek hai, wo dijiye','ठीक है, वो दीजिए'),
  ('624014fd-224e-4534-bb97-38405bc25109','hi','20 aur dijiye','20 और दीजिए'),
  ('979872fe-4c7c-442a-be16-852e48e9b443','hi','Sambhav nahi','संभव नहीं'),

  -- ── Money: Can I pay by UPI? ─────────────────────────────────────────
  ('e4bc982a-747a-4a5e-8a86-4d193e051bef','hi','Haan, yah QR scan karein','हां, यह QR स्कैन करें'),
  ('02a310eb-4462-4477-9baf-abe733182f90','hi','UPI kaam nahi kar raha','UPI काम नहीं कर रहा'),
  ('aeef124f-37c0-46ad-a6b9-e636f7c6543b','hi','Is number par bhejein','इस नंबर पर भेजें'),

  -- ── Money: Can I pay by card? ────────────────────────────────────────
  ('2d9e2dce-6489-4904-ae37-58e076fdc013','hi','Haan, card sweekar hai','हां, कार्ड स्वीकार है'),
  ('5d5782b9-bcd4-47e9-89de-d3038035b39a','hi','Card machine nahi hai','कार्ड मशीन नहीं है'),
  ('bb4a86e0-1ea2-4a38-9992-baa12edcd193','hi','UPI ya nakad hi','UPI या नकद ही'),

  -- ── Money: Can I pay cash? ───────────────────────────────────────────
  ('e6952413-872a-491b-94d9-917a847da16a','hi','Haan, nakad sweekar hai','हां, नकद स्वीकार है'),
  ('422c47c3-9a14-407e-a6a2-cb559812bb7d','hi','Nakad nahi, UPI hi','नकद नहीं, UPI ही'),
  ('26e9a80a-ce05-416b-b6fb-f136b6daa2b6','hi','Sahi raashi dijiye','सही राशि दीजिए'),

  -- ── Money: Do you have change? ───────────────────────────────────────
  ('12d2e50e-a185-4dfa-b19b-b83d4a9a4b80','hi','Haan, mere paas chhute hain','हां, मेरे पास छुट्टे हैं'),
  ('a32a4e04-b7f1-4876-9dce-eddc4ed45534','hi','Chhute nahi hain','छुट्टे नहीं हैं'),
  ('de1403cd-25fd-429d-911e-ce1da2f9f35a','hi','Ho sake to UPI se dein','हो सके तो UPI से दें'),

  -- ── Money: I don't have change ───────────────────────────────────────
  ('fe106726-a77a-4708-bd63-f6cd1cb9d382','hi','Theek hai, koi baat nahi','ठीक है, कोई बात नहीं'),
  ('06f77b25-9500-4ac7-8f04-4bf496461205','hi','Sahi raashi dein','सही राशि दें'),
  ('c610d4b3-22b6-49de-8ee5-b6fd2d471617','hi','UPI se bhugtan karein','UPI से भुगतान करें'),

  -- ── Money: Please give bill ──────────────────────────────────────────
  ('e85dd028-f676-4f07-aa2e-9ac351aa4cc8','hi','Yah raha aapka bill','यह रहा आपका बिल'),
  ('1dfc7e2c-d2f2-4360-b9da-607b4e3f32d1','hi','Print bill ya message?','प्रिंट बिल या मैसेज?'),
  ('77f8d0b6-14d5-439e-93df-15a52cb66fa2','hi','Ek minute','एक मिनट'),

  -- ── Shopping: Show me this ────────────────────────────────────────────
  ('856b0a36-26d9-416b-a627-ab510484c8c7','hi','Yah raha','यह रहा'),
  ('06cedf27-0424-4132-9236-64ce6e303cd0','hi','Yah dekhein','यह देखें'),
  ('9b82d836-054c-4f8e-a0cc-4eb2f76b84a8','hi','Aur kuch?','और कुछ?'),

  -- ── Shopping: I want this ────────────────────────────────────────────
  ('0dea1737-377e-45a1-808e-bd24ad46096d','hi','Theek hai','ठीक है'),
  ('6fd45ebc-f103-441c-9726-66fcc6e7a5ef','hi','Lijiye','लीजिए'),
  ('505477a9-8852-4986-b713-7aa2d9f939a8','hi','Ek aur chaahiye?','एक और चाहिए?'),

  -- ── Shopping: Do you have bigger size? ───────────────────────────────
  ('eb019294-4213-4c5e-b6c2-fa9c44223936','hi','Haan, upalabdh hai','हां, उपलब्ध है'),
  ('df4eee38-e443-4565-be89-18bdcc70340d','hi','Nahi, upalabdh nahi hai','नहीं, उपलब्ध नहीं है'),
  ('17fb6f13-90ab-43eb-86e2-8056e1f49ef4','hi','Kal check karein','कल चेक करें'),

  -- ── Shopping: Do you have smaller size? ──────────────────────────────
  ('8234ae8d-5c77-439e-b87a-c7e9cb18d222','hi','Haan, upalabdh hai','हां, उपलब्ध है'),
  ('cb1551fd-a527-43cd-9f0f-c34670cf3101','hi','Nahi, upalabdh nahi hai','नहीं, उपलब्ध नहीं है'),
  ('802eb215-a00f-4487-9435-21b62fac3851','hi','Yah size aazmaiye','यह साइज़ आज़माइए'),

  -- ── Shopping: Do you have another color? ─────────────────────────────
  ('0ef4f6b6-675d-480f-bc81-d60743276601','hi','Haan, yah rang','हां, यह रंग'),
  ('84443566-7ffb-4015-a866-197761119402','hi','Doosra rang nahi hai','दूसरा रंग नहीं है'),
  ('fa6fba72-dafe-4cba-839e-f57c5f2d6f93','hi','Sirf kaala/safed','सिर्फ काला/सफेद'),

  -- ── Shopping: Can I try this? ────────────────────────────────────────
  ('0860e2cf-72da-45fd-83b0-67ffbdf4f788','hi','Haan, kariye','हां, करिए'),
  ('60184d7c-33c7-4717-99b7-7d4da0bbe02b','hi','Trial nahi','ट्रायल नहीं'),
  ('2977cd10-fd6d-4b02-aa04-ae8fcda9ea8b','hi','Trial room istemal karein','ट्रायल रूम इस्तेमाल करें'),

  -- ── Shopping: Pack this please ───────────────────────────────────────
  ('65d87c2b-37cd-44e5-afdd-bcd514df7aca','hi','Theek hai','ठीक है'),
  ('c3ce7e66-b57e-420c-a846-2f7672131740','hi','Bag chaahiye?','बैग चाहिए?'),
  ('b4de82b0-bac8-460d-b12b-7c5103af82c3','hi','Abhi pack kar raha hoon','अभी पैक कर रहा हूं'),

  -- ── Shopping: I will take this ───────────────────────────────────────
  ('37cc18f3-ef18-45f2-baf2-ee4615248fac','hi','Achhi pasand','अच्छी पसंद'),
  ('81ee32e5-94b1-4a9c-82f4-591c5bb34eb9','hi','Billing par jaiye','बिलिंग पर जाइए'),
  ('a961a028-6acf-4b22-99af-1cbc19e981bf','hi','Dhanyavaad','धन्यवाद'),

  -- ── Groceries: Do you have fresh vegetables? ─────────────────────────
  ('f8854704-5f50-4c84-b828-1908d5e678ac','hi','Haan, taaza stock','हां, ताज़ा स्टॉक'),
  ('09c878c7-da44-490d-9897-626f1506b96a','hi','Nahi, purana stock','नहीं, पुराना स्टॉक'),
  ('4ee5464f-2426-497d-8961-161cff5124b2','hi','Abhi taaza aaya hai','अभी ताज़ा आया है'),

  -- ── Groceries: I want 1 kilo [item] ──────────────────────────────────
  ('b4e26408-d5e0-4f7c-9aa6-50b565abc9f4','hi','Theek hai, abhi tol raha hoon','ठीक है, अभी तोल रहा हूं'),
  ('affc3e49-675b-4b3b-8324-233cb6e0ff89','hi','Aur kuch chaahiye?','और कुछ चाहिए?'),
  ('28d6029b-54cf-4d25-8b38-4d4f4a732ed7','hi','Yah lijiye','यह लीजिए'),

  -- ── Groceries: Give me half kilo ─────────────────────────────────────
  ('5f1b065c-7821-49f5-a2f9-e4bfb576f351','hi','Theek hai','ठीक है'),
  ('28139fab-0fef-4b1b-8785-deb064e2dade','hi','Aur kuch?','और कुछ?'),
  ('8be8f51b-a15e-4513-aad5-018448796996','hi','Ho gaya','हो गया'),

  -- ── Groceries: Is this fresh? ────────────────────────────────────────
  ('5b4454b6-5131-41de-8f1e-910eeabfaafe','hi','Haan, taaza hai','हां, ताज़ा है'),
  ('02cad919-caac-48a7-becd-c149113da52c','hi','Nahi, kal ka stock','नहीं, कल का स्टॉक'),
  ('42886abc-f49e-4ea1-8e25-475c0ea47e1e','hi','Yah behtar hai, lijiye','यह बेहतर है, लीजिए'),

  -- ── Groceries: Please give good quality ──────────────────────────────
  ('e86405bf-a56c-4915-958e-a056b6752422','hi','Zaroor','ज़रूर'),
  ('d116b6da-fb3f-433d-b8f2-44b1204f98f1','hi','Yah sabse achhi quality hai','यह सबसे अच्छी क्वालिटी है'),
  ('bcad91a2-0dc1-4d73-b020-64cb02169314','hi','Check karke lijiye','चेक करके लीजिए'),

  -- ── Groceries: Please weigh properly ─────────────────────────────────
  ('e5da5cde-91c9-4e9b-8317-1def03ea6cdc','hi','Theek hai','ठीक है'),
  ('cb9edfdd-b181-46b8-b160-9fe6668c6189','hi','Wazan dekhein','वज़न देखें'),
  ('40baacae-5765-4b1c-ae0f-3bced00d1211','hi','Sahi ho gaya','सही हो गया'),

  -- ── Groceries: I need a bag ──────────────────────────────────────────
  ('0639b868-3b0d-487a-aef5-30fc083414ea','hi','Yah raha thaila','यह रहा थैला'),
  ('18f7fdbf-5f67-4199-9fa7-62f142e905d3','hi','Carry bag ka charge alag hai','कैरी बैग का चार्ज अलग है'),
  ('a80d1009-81ff-4395-a6cb-fec1bf884d0c','hi','Agli baar apna thaila laiye','अगली बार अपना थैला लाइए'),

  -- ── Groceries: That's enough ─────────────────────────────────────────
  ('2d344597-9a30-43e7-9c5e-488c6a1d7d95','hi','Theek hai','ठीक है'),
  ('93356cb2-1200-4121-8081-146b69afbe5e','hi','Aur kuch chaahiye?','और कुछ चाहिए?'),
  ('250bc544-33cc-46ec-a698-23cbe4883a7c','hi','Dhanyavaad','धन्यवाद'),

  -- ── Emergency: I need help ───────────────────────────────────────────
  ('90d3620b-8037-4534-b9d3-8f6e7fe48528','hi','Kya hua?','क्या हुआ?'),
  ('5a0501c7-f1ef-4123-889a-2e7cb3326a50','hi','Bataiye','बताइए'),
  ('d71dc2cb-2bd2-4418-9f53-a058328699da','hi','Main madad karunga','मैं मदद करूंगा'),

  -- ── Emergency: I am not feeling well ─────────────────────────────────
  ('0ab4170b-901e-4125-ac27-9786a38d6747','hi','Kya samasya hai?','क्या समस्या है?'),
  ('36464f7a-e020-4b95-94ce-9405dda62f56','hi','Baithiye','बैठिए'),
  ('df7d0d15-96c5-4da0-bf81-55ad5db3a8c9','hi','Aspatal jaiye','अस्पताल जाइए'),

  -- ── Emergency: Where is the hospital? ────────────────────────────────
  ('6616202c-a8bb-402f-8062-d863c35598b1','hi','Seedhe jaiye','सीधे जाइए'),
  ('77428b10-4eb3-4513-b71b-ae5f55cdac8f','hi','Baayin taraf hai','बाईं तरफ है'),
  ('f99e1301-e64b-4cb4-9b3e-d66a8229cc60','hi','Paas mein hai','पास में है'),

  -- ── Emergency: Call a doctor ─────────────────────────────────────────
  ('3193de95-7fe9-403f-89dd-63111cf97c53','hi','Abhi bula raha hoon','अभी बुला रहा हूं'),
  ('473cc4ce-3c86-4674-8c05-c0b690c7f0bf','hi','Doctor aa rahe hain','डॉक्टर आ रहे हैं'),
  ('25e564f8-37a2-480f-9d6f-299bb004c095','hi','Rukiye','रुकिए'),

  -- ── Emergency: Please come fast ──────────────────────────────────────
  ('ccc242ba-c253-443b-bc22-ee8d594aba15','hi','Aa raha hoon','आ रहा हूं'),
  ('628d740f-b28f-424e-b0b3-5bea05706d27','hi','2 minute','2 मिनट'),
  ('75997e20-c73c-4d21-9f8f-6e1179a56bc6','hi','Rukiye','रुकिए'),

  -- ── Emergency: Where is the pharmacy? ────────────────────────────────
  ('b32070f6-47b0-4fec-b3fa-60d6e62a716f','hi','Paas mein hai','पास में है'),
  ('1282a635-cc78-4e23-8ab7-40f481244701','hi','Seedhe jaiye','सीधे जाइए'),
  ('b8fd6aea-484d-4e07-9038-122bdacf29a8','hi','Daayein taraf hai','दाईं तरफ है'),

  -- ── Emergency: I am lost ─────────────────────────────────────────────
  ('15f7f0ac-1375-4a66-8567-1cb25ee7533a','hi','Aap kahan hain?','आप कहां हैं?'),
  ('b056b15f-75ae-4236-839b-c78fd4601d32','hi','Location bhejein','लोकेशन भेजें'),
  ('1ef8403c-96f4-407c-9eee-739dab035c1e','hi','Wahin rahein','वहीं रहें'),

  -- ── Emergency: Call the police ───────────────────────────────────────
  ('79d80bb9-c8ba-4902-8507-8f94a2fd8d16','hi','Abhi phone kar raha hoon','अभी फोन कर रहा हूं'),
  ('b4fcae0e-882a-4d76-85c3-51eb5c83a3b4','hi','Police aa rahi hai','पुलिस आ रही है'),
  ('c29fcc79-93ee-4b5a-bb3e-22bb801cda2f','hi','Chinta mat karein','चिंता मत करें'),

  -- ── Emergency: Do you understand English? ────────────────────────────
  ('d5b00d9f-ec74-4bc2-8c67-6aec6944d5da','hi','Haan','हां'),
  ('01c50f5e-d5ce-4b4d-92d6-d1785c7d275f','hi','Thoda','थोड़ा'),
  ('1ee4e32e-613a-4f64-b5e1-89027d85c901','hi','Nahi','नहीं'),

  -- ── Emergency: Please speak slowly ───────────────────────────────────
  ('39772f39-df57-42fa-b84d-80b6e84e0c2f','hi','Theek hai','ठीक है'),
  ('6b337336-eb1c-4e00-8c28-ba4218a25d80','hi','Main dheere bolunga','मैं धीरे बोलूंगा'),
  ('02573ab2-ce9c-4935-83ef-7cb1b5359793','hi','Bataiye','बताइए'),

  -- ── Nurse: Please sit here ────────────────────────────────────────────
  ('469291d1-0b67-450f-b1b9-1ec373991bab','hi','Theek hai','ठीक है'),
  ('9a641f71-97d2-417c-b6d4-a6e393383e4b','hi','Kya main wahan baith sakta hoon?','क्या मैं वहां बैठ सकता हूं?'),
  ('870b6015-3542-44b2-89a2-14240d144f92','hi','Main baithta hoon','मैं बैठता हूं'),

  -- ── Nurse: Please wait ───────────────────────────────────────────────
  ('4855beaa-15bc-414a-88b0-08ac78cc1477','hi','Theek hai, main intazaar karunga','ठीक है, मैं इंतज़ार करूंगा'),
  ('91da37e3-db65-4b5a-abfe-b69b7967f197','hi','Kitni der?','कितनी देर?'),
  ('bb7b4aa4-0f3a-4817-b5e0-f1d9534f7622','hi','Mujhe phone karein','मुझे फोन करें'),

  -- ── Nurse: What problem do you have? ─────────────────────────────────
  ('b7875552-8ba6-42a3-8b14-c7dac9c56e26','hi','Mujhe bukhar hai','मुझे बुखार है'),
  ('26d40193-cee7-40b6-8310-d024af7e5600','hi','Mujhe dard hai','मुझे दर्द है'),
  ('1955fe8b-94c8-4eb9-a9aa-9e2f131c729a','hi','Mujhe kamzori mahsoos ho rahi hai','मुझे कमज़ोरी महसूस हो रही है'),

  -- ── Nurse: Do you have fever? ────────────────────────────────────────
  ('4b29da1b-ecfe-4642-913c-d0d7e6c328f4','hi','Haan','हां'),
  ('cd82548f-9e01-439f-8ef1-f99a5dae9cb5','hi','Nahi','नहीं'),
  ('e2ddadf4-0198-412c-b104-037858afd852','hi','Subah se','सुबह से'),

  -- ── Nurse: Do you have pain? ─────────────────────────────────────────
  ('8eb2fa75-1d14-436f-9dbf-783ed9e4fb27','hi','Haan, bahut dard hai','हां, बहुत दर्द है'),
  ('a74c9bb9-5fa0-4e22-96be-c8acce4b08bb','hi','Thoda dard hai','थोड़ा दर्द है'),
  ('930d59fe-91ff-4401-9483-4ce725da2198','hi','Dard nahi hai','दर्द नहीं है'),

  -- ── Nurse: I will check BP ───────────────────────────────────────────
  ('3e5a6185-46ca-4025-8560-eca5d8af62ee','hi','Theek hai','ठीक है'),
  ('7177d5e5-9bb0-43d9-82f3-426a7bfa8522','hi','Abhi check karein','अभी चेक करें'),
  ('115f0f8d-7edf-45c6-bbd9-9caf2bc4aa4d','hi','Kya yah normal hai?','क्या यह नॉर्मल है?'),

  -- ── Nurse: Please take this medicine ─────────────────────────────────
  ('446323d2-6324-4159-8534-5954a4de44e5','hi','Kitni baar?','कितनी बार?'),
  ('eba965ee-2433-4d56-a634-c7b67b7c64a0','hi','Khaane se pehle ya baad mein?','खाने से पहले या बाद में?'),
  ('c261bc3e-9daf-45ba-8d0a-3f4497d7b588','hi','Theek hai, leta hoon','ठीक है, लेता हूं'),

  -- ── Nurse: Follow me ─────────────────────────────────────────────────
  ('c4a799b9-0268-4f93-ab42-c9d221de2101','hi','Theek hai','ठीक है'),
  ('91a19d68-f39a-4026-b848-fc5496706202','hi','Kahan jaana hai?','कहां जाना है?'),
  ('491c8a19-401e-45fc-a2c3-c053cd994f1a','hi','Main aa raha hoon','मैं आ रहा हूं'),

  -- ── Nurse: Doctor will come soon ─────────────────────────────────────
  ('bbc89beb-ca9d-402a-9a0a-6d66f64fdbcb','hi','Theek hai','ठीक है'),
  ('b912573f-5702-4e6d-b2f4-8c2b551521de','hi','Jaldi bulaaiye','जल्दी बुलाइए'),
  ('c9258773-be2f-4128-8d30-92593890417f','hi','Main intazaar karunga','मैं इंतज़ार करूंगा'),

  -- ── Nurse: Emergency case, come fast ─────────────────────────────────
  ('3e5cab37-9e92-4e46-ad1f-51f01a81088f','hi','Abhi aa raha hoon','अभी आ रहा हूं'),
  ('9a50a5b0-b683-48c8-b8a0-aa7c6053cbe4','hi','Doctor ko bulaiye','डॉक्टर को बुलाइए'),
  ('68e14a6f-4823-4980-8683-bf028cd07db4','hi','Stretcher laiye','स्ट्रेचर लाइए'),

  -- ── Doctor: What symptoms do you have? ───────────────────────────────
  ('a374bd02-2982-4219-8dce-969bd511c4a4','hi','Bukhar aur khansi','बुखार और खांसी'),
  ('f3d9b7ce-3aed-4f2c-b184-bb0fc8d7d396','hi','Sar dard','सिर दर्द'),
  ('a577cfa5-b660-4e78-aee7-a6b912e52abd','hi','Pet dard','पेट दर्द'),

  -- ── Doctor: Since when do you have this? ─────────────────────────────
  ('23683f12-cf46-4348-8984-c0a070800597','hi','Kal se','कल से'),
  ('d69527ac-afaa-4b02-83cf-a7c2cb43c925','hi','Subah se','सुबह से'),
  ('36a3de8d-dd72-49b8-96ef-36dea0db3a70','hi','3 dinon se','3 दिनों से'),

  -- ── Doctor: Do you have allergy? ─────────────────────────────────────
  ('8b052b5e-cf8f-4296-8e5e-a7de18e7f88f','hi','Haan','हां'),
  ('7d7344ae-915a-4b41-9f5a-52dce9fe1f0d','hi','Nahi','नहीं'),
  ('64bb5f3f-1c58-4c50-9f8f-384016068509','hi','Pakka nahi','पक्का नहीं'),

  -- ── Doctor: I will examine you ───────────────────────────────────────
  ('3e38b20c-a682-402e-8dec-1b09165de733','hi','Theek hai doctor','ठीक है डॉक्टर'),
  ('5fe6f697-954e-413c-926f-42ce20ae6550','hi','Dhyaan se check karein','ध्यान से चेक करें'),
  ('88046732-0af6-449b-8139-26a6d1deb1f4','hi','Mujhe bahut tej dard hai','मुझे बहुत तेज़ दर्द है'),

  -- ── Doctor: You need a blood test ────────────────────────────────────
  ('1436de0d-5be5-4b5b-98f8-d69aade70739','hi','Test kahan karvaaein?','टेस्ट कहां करवाएं?'),
  ('ddbdcadb-20ac-4bef-9c82-e72af8f80441','hi','Kya main abhi kar sakta hoon?','क्या मैं अभी कर सकता हूं?'),
  ('21183c62-4d58-4927-834d-f17150db6907','hi','Theek hai, karta hoon','ठीक है, करता हूं'),

  -- ── Doctor: Take this medicine twice daily ────────────────────────────
  ('1649b54d-8331-4b90-a7d8-4866b5d47f53','hi','Khaane se pehle ya baad mein?','खाने से पहले या बाद में?'),
  ('e5c319a8-8e7a-405d-bdc4-129f728c3b55','hi','Kitne din?','कितने दिन?'),
  ('262789b6-671a-44c0-bcad-616d3d8d8ed6','hi','Theek hai doctor','ठीक है डॉक्टर'),

  -- ── Doctor: No need to worry ─────────────────────────────────────────
  ('78c1bb9e-221c-4d7d-af45-fc0208aaab8a','hi','Dhanyavaad doctor','धन्यवाद डॉक्टर'),
  ('fae17a7d-e411-49be-9d9d-c4d78917432b','hi','Kya main jaldi theek ho jaunga?','क्या मैं जल्दी ठीक हो जाऊंगा?'),
  ('b554a00b-93e2-4e75-b881-208a98b8fe2e','hi','Mujhe dar lag raha hai','मुझे डर लग रहा है'),

  -- ── Doctor: You need rest ─────────────────────────────────────────────
  ('3f5754fa-8209-45b0-b2a5-c5fcad053686','hi','Kitne din aaraam?','कितने दिन आराम?'),
  ('ce5e139f-7834-4e53-af28-4e15c3ae2806','hi','Kya main office ja sakta hoon?','क्या मैं ऑफिस जा सकता हूं?'),
  ('d04c61e5-2fb1-415c-b94d-df5d3c1dc803','hi','Theek hai, aaraam karunga','ठीक है, आराम करूंगा'),

  -- ── Doctor: Come for review tomorrow ─────────────────────────────────
  ('e991a29d-caac-4750-ae02-6e3b0b79c85b','hi','Kitne baje?','कितने बजे?'),
  ('3a116fff-54f1-4436-b81a-ae19e601d370','hi','Theek hai, aaunga','ठीक है, आऊंगा'),
  ('15a3e609-f148-4943-aca8-f6ce4a955f25','hi','Kya shaam ko aa sakta hoon?','क्या शाम को आ सकता हूं?'),

  -- ── Doctor: Admit in hospital ────────────────────────────────────────
  ('dcd131fb-af47-4c29-8678-4c2c7c5aa724','hi','Kya yah gambhir hai?','क्या यह गंभीर है?'),
  ('51520a0f-ee17-4a3e-b3ba-ee8354abd56c','hi','Theek hai, admit karta hoon','ठीक है, एडमिट करता हूं'),
  ('47da550b-9f0c-4265-9742-b43e3de4c2e0','hi','Mere parivaar ko bataiye','मेरे परिवार को बताइए'),

  -- ── Software Engineer: Let's start the meeting ───────────────────────
  ('62cc43a6-199d-42cb-b61f-67a9b1679d84','hi','Haan, shuru kar rahe hain','हां, शुरू कर रहे हैं'),
  ('61057379-c635-4f3c-999e-67450762909d','hi','2 minute dijiye','2 मिनट दीजिए'),
  ('41022d88-6171-44e8-b178-8735edbee86c','hi','Abhi join kar raha hoon','अभी जॉइन कर रहा हूं'),

  -- ── Software Engineer: Can you share the update? ─────────────────────
  ('cab324b8-cb91-4a71-be05-9f5eba4e0b22','hi','Chat mein share kiya','चैट में शेयर किया'),
  ('46b66d9a-6449-499d-9036-8c1747a63c09','hi','Abhi share karta hoon','अभी शेयर करता हूं'),
  ('53749750-7443-4592-af71-aab8cff3c56f','hi','Abhi bhi kaam chal raha hai','अभी भी काम चल रहा है'),

  -- ── Software Engineer: Please check this issue ───────────────────────
  ('37556b48-2cb4-4cc4-8d0b-0862650103cb','hi','Theek hai, check kar raha hoon','ठीक है, चेक कर रहा हूं'),
  ('242aa26b-31ba-46d1-ab43-3af826d7b557','hi','Kya log share kar sakte hain?','क्या लॉग शेयर कर सकते हैं?'),
  ('515a2d70-3810-485a-b05b-b55b70158af0','hi','Main ise reproduce kar sakta hoon','मैं इसे रिप्रोड्यूस कर सकता हूं'),

  -- ── Software Engineer: This is blocked ───────────────────────────────
  ('68086a9d-064a-4f0b-9b8d-4128f894b047','hi','Kya block kar raha hai?','क्या ब्लॉक कर रहा है?'),
  ('70f17544-f476-42a4-a01a-98e48077347b','hi','Dependency chahiye','डिपेंडेंसी चाहिए'),
  ('9c0e74b0-f233-46d0-9bc6-b29be7f94867','hi','Lead ko escalate karein','लीड को एस्केलेट करें'),

  -- ── Software Engineer: I need access ─────────────────────────────────
  ('3758be90-c23e-4292-836c-bbe3ad8e74bd','hi','Main access dunga','मैं एक्सेस दूंगा'),
  ('4c0ac084-49a2-4728-be1c-e237d2886c02','hi','Request karein','रिक्वेस्ट करें'),
  ('404e8c5b-5403-49d5-9ff0-5ff40965ff82','hi','Approval ka intazaar hai','अप्रूवल का इंतज़ार है'),

  -- ── Software Engineer: I will fix and update ─────────────────────────
  ('8d4ee657-faf8-468c-945e-5890b46f9bf7','hi','Theek hai, dhanyavaad','ठीक है, धन्यवाद'),
  ('80bde787-244e-42eb-aadc-2b45d4caf296','hi','Kab tak?','कब तक?'),
  ('1b7fec01-2c69-4354-a4df-b64e139b735c','hi','Channel mein post karein','चैनल में पोस्ट करें'),

  -- ── Software Engineer: Please review my code ─────────────────────────
  ('a3f59856-714a-4e0b-a6ac-8ec041eccef4','hi','Zaroor, main review karunga','ज़रूर, मैं रिव्यू करूंगा'),
  ('282ebe9a-2b3a-4dcd-ac49-ba0e4432e639','hi','PR banaiye','PR बनाइए'),
  ('8ebe043c-54a2-4261-a407-d7a848fcd467','hi','Maine comment jode','मैंने कमेंट जोड़े'),

  -- ── Software Engineer: Can we deploy today? ──────────────────────────
  ('9fc6057b-bfc4-4c18-9656-283675568df0','hi','Haan, deploy ke liye taiyaar','हां, डिप्लॉय के लिए तैयार'),
  ('651e343b-e830-4528-8b47-960969971d0d','hi','Ek aur test chahiye','एक और टेस्ट चाहिए'),
  ('b676ad89-f0de-421d-9372-61df17c2cbfb','hi','Kal deploy karte hain','कल डिप्लॉय करते हैं'),

  -- ── Software Engineer: I need more time ──────────────────────────────
  ('15f83372-669a-4473-833e-8f0b53aa0c47','hi','Theek hai, samay lo','ठीक है, समय लो'),
  ('91e343b3-82e1-4587-a2bf-867cef22d644','hi','Kitna samay?','कितना समय?'),
  ('1ca7f4fc-b1f9-42ba-8fc8-1cddd1a70273','hi','Priority dijiye','प्रायोरिटी दीजिए'),

  -- ── Software Engineer: Task is completed ─────────────────────────────
  ('75f42ade-236c-4261-9143-09213e7d3446','hi','Bahut achha kaam','बहुत अच्छा काम'),
  ('1566c9b7-cef4-41eb-bc2b-cc3c2bfaad2b','hi','Agle task par jaiye','अगले टास्क पर जाइए'),
  ('db945292-dee8-4932-bd77-0e060a1d1c82','hi','Ticket band karein','टिकट बंद करें')

on conflict (reply_id, language_code)
do update set
  phonetic_text = excluded.phonetic_text,
  native_text   = excluded.native_text;
