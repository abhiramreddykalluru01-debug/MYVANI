-- =========================================================================
-- VANI: Full Telugu reply translations — all replies by UUID
-- Run AFTER seed_telugu_phrases_full.sql
-- Idempotent: safe to re-run (uses ON CONFLICT DO UPDATE)
-- =========================================================================

insert into public.reply_translations
  (reply_id, language_code, phonetic_text, native_text)
values
  -- ── Greetings: Hi ─────────────────────────────────────────────────────
  ('ffec8ac1-e5ab-4f14-ba9e-1c7a64fe3083','te','Haay','హాయ్'),
  ('304c166d-79fa-4f42-b70b-b65fadd3360c','te','Hello','హలో'),
  ('d06e0ea8-ef64-4d0c-8405-495433c4193d','te','Hey','హే'),

  -- ── Greetings: How are you? ───────────────────────────────────────────
  ('525b9655-ab8a-463f-b711-fefba662c439','te','Nenu baagunnanu','నేను బాగున్నాను'),
  ('69d6eae7-5ed1-4a6c-b3de-01ecd01cc136','te','Nenu manchigaa unnanu','నేను మంచిగా ఉన్నాను'),
  ('f0abbebf-bd60-4c8e-a37d-2f68e8bbc5fb','te','괜 괜찮아','నేను బాగున్నాను'),

  -- ── Greetings: I am fine ──────────────────────────────────────────────
  ('65af9ebf-bd09-4b68-bde4-a4f625f8507d','te','Baagundi','బాగుంది'),
  ('3884c5ef-f48d-441d-ae43-083414e8517f','te','Baagundi','బాగుంది'),
  ('dbe927c5-6e0e-4f6b-95f4-50be732874d7','te','Adhbhutam','అద్భుతం'),

  -- ── Greetings: Thank you ──────────────────────────────────────────────
  ('58dfaf4b-02b1-453b-8433-83fa85099cc2','te','Swaagatam','స్వాగతం'),
  ('d1a81700-92d3-4a3d-8d6f-deb9dcd94f43','te','Parvaaleedu','పర్వాలేదు'),
  ('b96b77b1-0a81-4b5b-b1d8-ff5e4d64eee1','te','Sare','సరే'),

  -- ── Greetings: My name is ─────────────────────────────────────────────
  ('aae29c0b-26e5-4109-98b3-ef6e633fad6e','te','Naa peru [Name]','నా పేరు [Name]'),
  ('1e3a8067-c8c4-4496-9add-a4b8ccefd595','te','Manchii peru','మంచి పేరు'),
  ('f779784f-6595-4d91-b9a5-75a8f97b2f41','te','Mimmalni kalavadam santosham','మిమ్మల్ని కలవడం సంతోషం'),

  -- ── Greetings: I am new to this city ─────────────────────────────────
  ('5e491d90-6a27-459e-9284-f2ee476ee197','te','Arthameindi','అర్థమైంది'),
  ('517b14b1-375c-4cd0-8beb-1f14e1276f60','te','Swaagatam','స్వాగతం'),
  ('811b56f3-fae5-4c37-82b6-d20331235edf','te','Ee jaaga edi?','ఈ జాగా ఎది?'),

  -- ── Greetings: I don't know Kannada ──────────────────────────────────
  ('91ec6b5f-7de7-4d91-a31a-7cdf588de7cf','te','Parvaaleedu','పర్వాలేదు'),
  ('4b1be5c3-dac3-4ed7-89c7-ae709e6adf80','te','Nenu mellaga maatlaadataanu','నేను మెల్లగా మాట్లాడతాను'),
  ('c2e1b86d-5f23-4232-9917-61b21e82d1fd','te','Meeru ki Hindi telusaa?','మీకు Hindi తెలుసా?'),

  -- ── Greetings: Where do you work? ────────────────────────────────────
  ('ea71eb4b-e9c4-4d6e-b952-b95b16cc6ecf','te','Nenu ikkade pani chestanu','నేను ఇక్కడే పని చేస్తాను'),
  ('7bd60220-3eb7-4bbc-8660-b418621aeda0','te','Nenu office lo pani chestanu','నేను office లో పని చేస్తాను'),
  ('c4487d55-9a37-47f0-8796-7d83b40c1dcd','te','Nenu shop lo pani chestanu','నేను shop లో పని చేస్తాను'),

  -- ── Greetings: Please speak slowly ───────────────────────────────────
  ('e25623a7-c6d0-4494-ab63-47e0c589b070','te','Sare','సరే'),
  ('db6099f4-1f73-4edb-9583-22dfe5ae3f47','te','Nenu mellaga maatlaadataanu','నేను మెల్లగా మాట్లాడతాను'),
  ('49167e19-d5f7-4c9e-bc0a-00e9ffa1d35b','te','Cheppandi','చెప్పండి'),

  -- ── Greetings: Sorry ─────────────────────────────────────────────────
  ('170be2ca-056e-4ac5-9816-d77684f813f9','te','Parvaaleedu','పర్వాలేదు'),
  ('61dd4d67-d0a1-4e1e-b7eb-9fb25741b167','te','Parvaaleedu','పర్వాలేదు'),
  ('fa9f0470-87ba-4798-af7f-86bf8efecc20','te','Sare','సరే'),

  -- ── Food: What is available? ─────────────────────────────────────────
  ('02bc1bea-151c-4ef1-adf7-c4a3446b48c0','te','Idli undi','Idli ఉంది'),
  ('81849886-b36b-4575-bce8-f819e1eca571','te','Meals unnaayi','Meals ఉన్నాయి'),
  ('f2ab1a9a-ba48-4d9b-8b56-ca7985b92115','te','Dosa undi','Dosa ఉంది'),

  -- ── Food: I want food ────────────────────────────────────────────────
  ('735c60cf-8101-4cc3-819a-923e70c1dc09','te','Meeru ki emi kaavali?','మీకు ఏమి కావాలి?'),
  ('930d67cb-be0e-4c91-a34e-7ba09083a0a6','te','Meals unnaayi','Meals ఉన్నాయి'),
  ('a8d240f3-2a64-4db3-8c2e-3828eb39f328','te','Aagandi','ఆగండి'),

  -- ── Food: I want water ───────────────────────────────────────────────
  ('ab2f39de-019b-4797-bc8c-6c194d05aeac','te','Ippoode istaanu','ఇప్పుడే ఇస్తాను'),
  ('9c3c9dc2-eb9c-4c5d-bc25-f5235680bf2c','te','Undi','ఉంది'),
  ('274136fa-0499-47b8-a8dd-040e2d0d43fb','te','Aagandi','ఆగండి'),

  -- ── Food: I want one plate ───────────────────────────────────────────
  ('f905cab8-f1af-40da-ab5c-692bf0582ddf','te','Ee item?','ఏ item?'),
  ('3a796928-0fcb-4943-ad6d-b2b6afd1d3ea','te','Sare','సరే'),
  ('345f146e-c190-4b2d-ac80-07e0d51e8984','te','Ippoode vasthunnaanu','ఇప్పుడే వస్తున్నాను'),

  -- ── Food: Make it less spicy ─────────────────────────────────────────
  ('501d6386-cb26-4c4e-8f16-92056a3fd038','te','Sare','సరే'),
  ('3be8c450-4f01-4e3e-90e1-93ae9cebb316','te','Koddiga kaaram parvaaleedaa?','కొద్దిగా కారం పర్వాలేదా?'),
  ('dc42c547-c346-438e-a7b9-a034316ae9b6','te','Tagginchaleenu','తగ్గించలేను'),

  -- ── Food: Do you have [item]? ────────────────────────────────────────
  ('b54da2df-43a5-4b50-8375-41f0872b986f','te','Avunu undi','అవును ఉంది'),
  ('f37b7324-2dc3-495d-ac47-f9c00f187fcc','te','Andubaatuloo ledu','అందుబాటులో లేదు'),
  ('9212ec97-9047-4b1e-b02e-116007097c9c','te','Samayam padutundi','సమయం పడుతుంది'),

  -- ── Food: Give me one tea ────────────────────────────────────────────
  ('3f4cdf58-a49a-4ef0-ac88-4bcee0617c6e','te','Sare','సరే'),
  ('fb9cc7b5-edc8-437d-8023-d7ea896e857d','te','Ippoode vasthunnaanu','ఇప్పుడే వస్తున్నాను'),
  ('eb3065ee-5a75-4f4e-9822-d3229726c667','te','Aagandi','ఆగండి'),

  -- ── Food: Give me one coffee ─────────────────────────────────────────
  ('e6d5b08d-1eff-4047-a60d-babe02399252','te','Sare','సరే'),
  ('d07bbb8a-2134-4dab-a2bf-8506bf446cd5','te','Taazaaga chestaanu','తాజాగా చేస్తున్నాను'),
  ('75be432f-0d7c-47cd-90df-421a25b81c09','te','Aagandi','ఆగండి'),

  -- ── Food: How much is this? (Food) ───────────────────────────────────
  ('6aaf9169-78b6-4160-a0f7-c02a0afb5ce8','te','50 rupaayalu','50 రూపాయలు'),
  ('be77fd75-560e-4394-adf5-d48eb2d644e0','te','80 rupaayalu','80 రూపాయలు'),
  ('8743c8e2-0388-4a7c-89d6-ea40ef1c3a4f','te','100 rupaayalu','100 రూపాయలు'),

  -- ── Food: The food is good ───────────────────────────────────────────
  ('e5f56085-07b5-4d33-a365-f21a852dc8e2','te','Dhanyavaadalu','ధన్యవాదాలు'),
  ('af60686a-14bf-4a40-9117-747504e3684f','te','Inkaa kaavaalaa?','ఇంకా కావాలా?'),
  ('2dbb32f1-b537-4273-a006-979d5af5cfd7','te','Santosham','సంతోషం'),

  -- ── Travel: Where is this place? ─────────────────────────────────────
  ('42702bd6-136b-4ff0-a656-dabafa1a5528','te','Neerugaa vellandi','నేరుగా వెళ్ళండి'),
  ('db3531a7-012c-46ec-93df-5d0a6cd71ccb','te','Edamaki undi','ఎడమ వైపు ఉంది'),
  ('e2c38781-25ac-4208-abaf-b71634eb43fa','te','Kudi vaipuki undi','కుడి వైపు ఉంది'),

  -- ── Travel: I want to go here ────────────────────────────────────────
  ('0819de77-d322-471d-b6f1-456f690a3fe1','te','Sare','సరే'),
  ('695e60cf-dcd0-4556-b901-990a150e774a','te','Koorchokondi','కూర్చోండి'),
  ('30f7098c-5d49-418a-9b3f-e59dfd1b4014','te','Ippoode velthunnaanu','ఇప్పుడే వెళ్తున్నాను'),

  -- ── Travel: Can you come? ────────────────────────────────────────────
  ('fb80587b-2473-4245-a011-54b9dc991907','te','Avunu nenu vastaanu','అవును నేను వస్తాను'),
  ('864cde71-dc64-4daa-b145-039a80ad8d5c','te','5 nimishaalu aagandi','5 నిమిషాలు ఆగండి'),
  ('39599fa3-4823-4bb3-ba46-21e0a461bc2c','te','Raalenu','రాలేను'),

  -- ── Travel: How much is the fare? ────────────────────────────────────
  ('ec6381e9-009d-451c-89dc-401bd9529aa1','te','100 rupaayalu','100 రూపాయలు'),
  ('a87f26b6-3a2d-4124-b045-de9d274c23aa','te','150 rupaayalu','150 రూపాయలు'),
  ('57a9bc67-81e1-4136-80c4-1c254e7381e3','te','Meter prakaaram','Meter ప్రకారం'),

  -- ── Travel: Go straight ──────────────────────────────────────────────
  ('072946d1-4aae-41c6-abc3-9d8905bfb5dd','te','Sare','సరే'),
  ('d26fc193-ab08-4010-b1f8-7674cd8781a9','te','Traffic undi','Traffic ఉంది'),
  ('0edbb744-22bd-4d57-b248-67dca19516ab','te','Velthunnaanu','వెళ్తున్నాను'),

  -- ── Travel: Turn left ────────────────────────────────────────────────
  ('15ddd93d-79bf-42a4-8946-c42f295631b3','te','Sare','సరే'),
  ('e3a9af9e-e10c-465d-ae58-3f458cb8d58d','te','Ikkadaa?','ఇక్కడా?'),
  ('1e611142-034c-4f03-8dff-666fe9ea1371','te','Tirugutunnaanu','తిరుగుతున్నాను'),

  -- ── Travel: Turn right ───────────────────────────────────────────────
  ('af64b3b2-8689-4a7f-a868-7a0c1bd0f47b','te','Sare','సరే'),
  ('8b479f70-a9ab-42f8-9823-49df899a78b6','te','Ikkadaa?','ఇక్కడా?'),
  ('77fb2341-95c1-4327-b9a2-932077403101','te','Tirugutunnaanu','తిరుగుతున్నాను'),

  -- ── Travel: How far is it? ───────────────────────────────────────────
  ('c08d1cb7-e309-4e20-a214-3682766af33b','te','2 km undi','2 km ఉంది'),
  ('734627eb-1961-43dc-bbed-390f9e6248ea','te','10 nimishaalu','10 నిమిషాలు'),
  ('bc152de4-29f7-486a-b10d-7516e488b76f','te','Daggarloo undi','దగ్గరలో ఉంది'),

  -- ── Travel: Stop here ────────────────────────────────────────────────
  ('47796a57-a477-4350-a540-976018f48cd9','te','Sare','సరే'),
  ('98812167-0c1d-4842-b6f1-7ecdabf90b35','te','Aaputhunnaanu','ఆపుతున్నాను'),
  ('5e400644-330e-41a2-9fd6-7f818ba31114','te','Ikkadaa?','ఇక్కడా?'),

  -- ── Travel: Wait here ────────────────────────────────────────────────
  ('4b03361f-a7cd-43b4-8ebd-80157263a233','te','Sare','సరే'),
  ('46d33972-94f4-4e95-b0dc-e98f66dab6cb','te','Enta sepu?','ఎంత సేపు?'),
  ('cb874f2a-b410-4952-996f-ba9daca02ecb','te','2 nimishaalu sare','2 నిమిషాలు సరే'),

  -- ── Money: How much is this? (Money) ─────────────────────────────────
  ('4275321c-ed0d-4fe8-9f47-4a7cea0ecf7c','te','100 rupaayalu','100 రూపాయలు'),
  ('0098de93-af22-4983-bd18-6766fb55e5d5','te','Fix dhara','Fix ధర'),
  ('27d7db96-3c10-49fd-9c26-bf6cc3c8f7e4','te','Idi kooda check cheyyandi','ఇది కూడా check చేయండి'),

  -- ── Money: Too expensive ─────────────────────────────────────────────
  ('97fa4c26-6626-4a74-b619-a1d8a9d094d5','te','Sare, taggistaanu','సరే, తగ్గిస్తాను'),
  ('1b6a7859-9072-4f1a-a165-5c99323be0d6','te','Fix dhara','Fix ధర'),
  ('4cf284c3-a3bf-4a2b-8526-747bc2072405','te','Discount ledu','Discount లేదు'),

  -- ── Money: Please reduce the price ───────────────────────────────────
  ('04c914ea-ba33-4e23-b26d-6fedcc0c1980','te','Enta kaavali?','ఎంత కావాలి?'),
  ('31c894f1-1eea-4ed9-9596-c373e644bfa3','te','Sare, final dhara idhenta','సరే, final ధర ఇంత'),
  ('dd21ac9b-3a21-48af-8d19-542de0092daa','te','Tagginchaleenu','తగ్గించలేను'),

  -- ── Money: Final price? ──────────────────────────────────────────────
  ('0c03fd03-fea1-4531-abe2-20d0d0c9425f','te','Idi final','ఇది final'),
  ('b21a58a5-e2e2-4e8b-a276-300c61f6fec0','te','Chivari discount icchaanu','చివరి discount ఇచ్చాను'),
  ('014a0547-89ce-4a42-a4ad-517ccc27a698','te','Tagginpu ledu','తగ్గింపు లేదు'),

  -- ── Money: Any discount? ─────────────────────────────────────────────
  ('351b2dc9-107d-4b21-b5ed-cd1f55ecd5ad','te','Avunu, koddiga discount','అవును, కొద్దిగా discount'),
  ('dc967147-2e10-4f33-94b8-76820a42b17e','te','Discount ledu','Discount లేదు'),
  ('ed746fa5-f39b-4c0d-a858-535749ecb74a','te','Rendu items ki maatrame','రెండు items కి మాత్రమే'),

  -- ── Money: I have only [amount] ──────────────────────────────────────
  ('23c92dee-5af4-4a1e-a268-d6afa1cb05cd','te','Sare, adi ivvandi','సరే, అది ఇవ్వండి'),
  ('624014fd-224e-4534-bb97-38405bc25109','te','20 ekkuva ivvandi','20 ఎక్కువ ఇవ్వండి'),
  ('979872fe-4c7c-442a-be16-852e48e9b443','te','Kuduradu','కుదరదు'),

  -- ── Money: Can I pay by UPI? ─────────────────────────────────────────
  ('e4bc982a-747a-4a5e-8a86-4d193e051bef','te','Avunu, ee QR scan cheyyandi','అవును, ఈ QR scan చేయండి'),
  ('02a310eb-4462-4477-9baf-abe733182f90','te','UPI pani cheyyatledu','UPI పని చేయడం లేదు'),
  ('aeef124f-37c0-46ad-a6b9-e636f7c6543b','te','Ee number ki pay cheyyandi','ఈ number కి pay చేయండి'),

  -- ── Money: Can I pay by card? ────────────────────────────────────────
  ('2d9e2dce-6489-4904-ae37-58e076fdc013','te','Avunu, card angeekaristaam','అవును, card అంగీకరిస్తాము'),
  ('5d5782b9-bcd4-47e9-89de-d3038035b39a','te','Card machine ledu','Card machine లేదు'),
  ('bb4a86e0-1ea2-4a38-9992-baa12edcd193','te','UPI ledaa cash maatrame','UPI లేదా cash మాత్రమే'),

  -- ── Money: Can I pay cash? ───────────────────────────────────────────
  ('e6952413-872a-491b-94d9-917a847da16a','te','Avunu, cash angeekaristaam','అవును, cash అంగీకరిస్తాము'),
  ('422c47c3-9a14-407e-a6a2-cb559812bb7d','te','Cash ledu, UPI maatrame','Cash లేదు, UPI మాత్రమే'),
  ('26e9a80a-ce05-416b-b6fb-f136b6daa2b6','te','Sarigga mottam ivvandi','సరైన మొత్తం ఇవ్వండి'),

  -- ── Money: Do you have change? ───────────────────────────────────────
  ('12d2e50e-a185-4dfa-b19b-b83d4a9a4b80','te','Avunu, naa daggara change undi','అవును, నా దగ్గర change ఉంది'),
  ('a32a4e04-b7f1-4876-9dce-eddc4ed45534','te','Change ledu','Change లేదు'),
  ('de1403cd-25fd-429d-911e-ce1da2f9f35a','te','Veelaite UPI tho pay cheyyandi','వీలైతే UPI తో pay చేయండి'),

  -- ── Money: I don't have change ───────────────────────────────────────
  ('fe106726-a77a-4708-bd63-f6cd1cb9d382','te','Sare, parvaaleedu','సరే, పర్వాలేదు'),
  ('06f77b25-9500-4ac7-8f04-4bf496461205','te','Sarigga mottam ivvandi','సరైన మొత్తం ఇవ్వండి'),
  ('c610d4b3-22b6-49de-8ee5-b6fd2d471617','te','UPI tho pay cheyyandi','UPI తో pay చేయండి'),

  -- ── Money: Please give bill ──────────────────────────────────────────
  ('e85dd028-f676-4f07-aa2e-9ac351aa4cc8','te','Idigoo mee bill','ఇదిగో మీ bill'),
  ('1dfc7e2c-d2f2-4360-b9da-607b4e3f32d1','te','Print bill ivvaalaa ledaa message?','Print bill ఇవ్వాలా లేదా message?'),
  ('77f8d0b6-14d5-439e-93df-15a52cb66fa2','te','Oka nimisham','ఒక నిమిషం'),

  -- ── Shopping: Show me this ────────────────────────────────────────────
  ('856b0a36-26d9-416b-a627-ab510484c8c7','te','Idigoo','ఇదిగో'),
  ('06cedf27-0424-4132-9236-64ce6e303cd0','te','Idi choodi','ఇది చూడండి'),
  ('9b82d836-054c-4f8e-a0cc-4eb2f76b84a8','te','Inkaa emainaa?','ఇంకా ఏమైనా?'),

  -- ── Shopping: I want this ────────────────────────────────────────────
  ('0dea1737-377e-45a1-808e-bd24ad46096d','te','Sare','సరే'),
  ('6fd45ebc-f103-441c-9726-66fcc6e7a5ef','te','Teesukundi','తీసుకోండి'),
  ('505477a9-8852-4986-b713-7aa2d9f939a8','te','Inkaa okati kaavaalaa?','ఇంకా ఒకటి కావాలా?'),

  -- ── Shopping: Do you have bigger size? ───────────────────────────────
  ('eb019294-4213-4c5e-b6c2-fa9c44223936','te','Avunu, undi','అవును, ఉంది'),
  ('df4eee38-e443-4565-be89-18bdcc70340d','te','Ledu, andubaatuloo ledu','లేదు, అందుబాటులో లేదు'),
  ('17fb6f13-90ab-43eb-86e2-8056e1f49ef4','te','Repu check cheyyandi','రేపు check చేయండి'),

  -- ── Shopping: Do you have smaller size? ──────────────────────────────
  ('8234ae8d-5c77-439e-b87a-c7e9cb18d222','te','Avunu, undi','అవును, ఉంది'),
  ('cb1551fd-a527-43cd-9f0f-c34670cf3101','te','Ledu, andubaatuloo ledu','లేదు, అందుబాటులో లేదు'),
  ('802eb215-a00f-4487-9435-21b62fac3851','te','Ee size try cheyyandi','ఈ size try చేయండి'),

  -- ── Shopping: Do you have another color? ─────────────────────────────
  ('0ef4f6b6-675d-480f-bc81-d60743276601','te','Avunu, ee rangu','అవును, ఈ రంగు'),
  ('84443566-7ffb-4015-a866-197761119402','te','Vere rangu ledu','వేరే రంగు లేదు'),
  ('fa6fba72-dafe-4cba-839e-f57c5f2d6f93','te','Nalupu/telupu maatrame','నలుపు/తెలుపు మాత్రమే'),

  -- ── Shopping: Can I try this? ────────────────────────────────────────
  ('0860e2cf-72da-45fd-83b0-67ffbdf4f788','te','Avunu, cheyyandi','అవును, చేయండి'),
  ('60184d7c-33c7-4717-99b7-7d4da0bbe02b','te','Trial ledu','Trial లేదు'),
  ('2977cd10-fd6d-4b02-aa04-ae8fcda9ea8b','te','Trial room vaadandi','Trial room వాడండి'),

  -- ── Shopping: Pack this please ───────────────────────────────────────
  ('65d87c2b-37cd-44e5-afdd-bcd514df7aca','te','Sare','సరే'),
  ('c3ce7e66-b57e-420c-a846-2f7672131740','te','Bag kaavaalaa?','Bag కావాలా?'),
  ('b4de82b0-bac8-460d-b12b-7c5103af82c3','te','Ippoode pack chestaanu','ఇప్పుడే pack చేస్తున్నాను'),

  -- ── Shopping: I will take this ───────────────────────────────────────
  ('37cc18f3-ef18-45f2-baf2-ee4615248fac','te','Manchii choice','మంచి choice'),
  ('81ee32e5-94b1-4a9c-82f4-591c5bb34eb9','te','Billing ki vellandi','Billing కి వెళ్ళండి'),
  ('a961a028-6acf-4b22-99af-1cbc19e981bf','te','Dhanyavaadalu','ధన్యవాదాలు'),

  -- ── Groceries: Do you have fresh vegetables? ─────────────────────────
  ('f8854704-5f50-4c84-b828-1908d5e678ac','te','Avunu, taaza stock','అవును, తాజా stock'),
  ('09c878c7-da44-490d-9897-626f1506b96a','te','Ledu, paata stock maatrame','లేదు, పాత stock మాత్రమే'),
  ('4ee5464f-2426-497d-8961-161cff5124b2','te','Taazaaga ippoode vacchindi','తాజాగా ఇప్పుడే వచ్చింది'),

  -- ── Groceries: I want 1 kilo [item] ──────────────────────────────────
  ('b4e26408-d5e0-4f7c-9aa6-50b565abc9f4','te','Sare, ippoode tustaanu','సరే, ఇప్పుడే తూస్తున్నాను'),
  ('affc3e49-675b-4b3b-8324-233cb6e0ff89','te','Inkaa emainaa kaavaalaa?','ఇంకా ఏమైనా కావాలా?'),
  ('28d6029b-54cf-4d25-8b38-4d4f4a732ed7','te','Idi teesukundi','ఇది తీసుకోండి'),

  -- ── Groceries: Give me half kilo ─────────────────────────────────────
  ('5f1b065c-7821-49f5-a2f9-e4bfb576f351','te','Sare','సరే'),
  ('28139fab-0fef-4b1b-8785-deb064e2dade','te','Inkaa emainaa?','ఇంకా ఏమైనా?'),
  ('8be8f51b-a15e-4513-aad5-018448796996','te','Ayindi','అయింది'),

  -- ── Groceries: Is this fresh? ────────────────────────────────────────
  ('5b4454b6-5131-41de-8f1e-910eeabfaafe','te','Avunu, taazaaga undi','అవును, తాజాగా ఉంది'),
  ('02cad919-caac-48a7-becd-c149113da52c','te','Ledu, ninnatii stock','లేదు, నిన్నటి stock'),
  ('42886abc-f49e-4ea1-8e25-475c0ea47e1e','te','Idi manchidi teesukundi','ఇది మంచిది తీసుకోండి'),

  -- ── Groceries: Please give good quality ──────────────────────────────
  ('e86405bf-a56c-4915-958e-a056b6752422','te','Tappakunda','తప్పకుండా'),
  ('d116b6da-fb3f-433d-b8f2-44b1204f98f1','te','Idi attyuttama quality','ఇది అత్యుత్తమ quality'),
  ('bcad91a2-0dc1-4d73-b020-64cb02169314','te','Check chesi teesukundi','Check చేసి తీసుకోండి'),

  -- ── Groceries: Please weigh properly ─────────────────────────────────
  ('e5da5cde-91c9-4e9b-8317-1def03ea6cdc','te','Sare','సరే'),
  ('cb9edfdd-b181-46b8-b160-9fe6668c6189','te','Baruvu choodi','బరువు చూడండి'),
  ('40baacae-5765-4b1c-ae0f-3bced00d1211','te','Sarigaa chesaanu','సరిగ్గా చేశాను'),

  -- ── Groceries: I need a bag ──────────────────────────────────────────
  ('0639b868-3b0d-487a-aef5-30fc083414ea','te','Idigoo saanchaa','ఇదిగో సంచా'),
  ('18f7fdbf-5f67-4199-9fa7-62f142e905d3','te','Carry bag charge adanamgaa','Carry bag charge అదనంగా'),
  ('a80d1009-81ff-4395-a6cb-fec1bf884d0c','te','Tarvaata sonta saanchaa teesukurandi','తర్వాత సొంత సంచా తీసుకురండి'),

  -- ── Groceries: That's enough ────────────────────────────────────────
  ('2d344597-9a30-43e7-9c5e-488c6a1d7d95','te','Sare','సరే'),
  ('93356cb2-1200-4121-8081-146b69afbe5e','te','Inkaa emainaa kaavaalaa?','ఇంకా ఏమైనా కావాలా?'),
  ('250bc544-33cc-46ec-a698-23cbe4883a7c','te','Dhanyavaadalu','ధన్యవాదాలు'),

  -- ── Emergency: I need help ───────────────────────────────────────────
  ('90d3620b-8037-4534-b9d3-8f6e7fe48528','te','Emi jarigindi?','ఏమి జరిగింది?'),
  ('5a0501c7-f1ef-4123-889a-2e7cb3326a50','te','Cheppandi','చెప్పండి'),
  ('d71dc2cb-2bd2-4418-9f53-a058328699da','te','Nenu help chestaanu','నేను help చేస్తాను'),

  -- ── Emergency: I am not feeling well ─────────────────────────────────
  ('0ab4170b-901e-4125-ac27-9786a38d6747','te','Emi samasya?','ఏమి సమస్య?'),
  ('36464f7a-e020-4b95-94ce-9405dda62f56','te','Koorchokondi','కూర్చోండి'),
  ('df7d0d15-96c5-4da0-bf81-55ad5db3a8c9','te','Aspatri ki vellandi','ఆస్పత్రికి వెళ్ళండి'),

  -- ── Emergency: Where is the hospital? ────────────────────────────────
  ('6616202c-a8bb-402f-8062-d863c35598b1','te','Neerugaa vellandi','నేరుగా వెళ్ళండి'),
  ('77428b10-4eb3-4513-b71b-ae5f55cdac8f','te','Edama vaipun undi','ఎడమ వైపున ఉంది'),
  ('f99e1301-e64b-4cb4-9b3e-d66a8229cc60','te','Daggarlooundi','దగ్గరలోఉంది'),

  -- ── Emergency: Call a doctor ─────────────────────────────────────────
  ('3193de95-7fe9-403f-89dd-63111cf97c53','te','Ippoode pilustaanu','ఇప్పుడే పిలుస్తున్నాను'),
  ('473cc4ce-3c86-4674-8c05-c0b690c7f0bf','te','Doctor vasthunnaaru','డాక్టర్ వస్తున్నారు'),
  ('25e564f8-37a2-480f-9d6f-299bb004c095','te','Aagandi','ఆగండి'),

  -- ── Emergency: Please come fast ──────────────────────────────────────
  ('ccc242ba-c253-443b-bc22-ee8d594aba15','te','Vasthunnaanu','వస్తున్నాను'),
  ('628d740f-b28f-424e-b0b3-5bea05706d27','te','2 nimishaalu','2 నిమిషాలు'),
  ('75997e20-c73c-4d21-9f8f-6e1179a56bc6','te','Aagandi','ఆగండి'),

  -- ── Emergency: Where is the pharmacy? ────────────────────────────────
  ('b32070f6-47b0-4fec-b3fa-60d6e62a716f','te','Daggarlooundi','దగ్గరలో ఉంది'),
  ('1282a635-cc78-4e23-8ab7-40f481244701','te','Neerugaa vellandi','నేరుగా వెళ్ళండి'),
  ('b8fd6aea-484d-4e07-9038-122bdacf29a8','te','Kudi vaipun undi','కుడి వైపున ఉంది'),

  -- ── Emergency: I am lost ─────────────────────────────────────────────
  ('15f7f0ac-1375-4a66-8567-1cb25ee7533a','te','Meeru ekkada unnaru?','మీరు ఎక్కడ ఉన్నారు?'),
  ('b056b15f-75ae-4236-839b-c78fd4601d32','te','Location send cheyyandi','Location send చేయండి'),
  ('1ef8403c-96f4-407c-9eee-739dab035c1e','te','Akkade undandi','అక్కడే ఉండండి'),

  -- ── Emergency: Call the police ───────────────────────────────────────
  ('79d80bb9-c8ba-4902-8507-8f94a2fd8d16','te','Ippoode pilustaanu','ఇప్పుడే పిలుస్తున్నాను'),
  ('b4fcae0e-882a-4d76-85c3-51eb5c83a3b4','te','Police vasthunnaaru','పోలీసులు వస్తున్నారు'),
  ('c29fcc79-93ee-4b5a-bb3e-22bb801cda2f','te','Bayapadakandi','భయపడకండి'),

  -- ── Emergency: Do you understand English? ────────────────────────────
  ('d5b00d9f-ec74-4bc2-8c67-6aec6944d5da','te','Avunu','అవును'),
  ('01c50f5e-d5ce-4b4d-92d6-d1785c7d275f','te','Koddiga','కొద్దిగా'),
  ('1ee4e32e-613a-4f64-b5e1-89027d85c901','te','Ledu','లేదు'),

  -- ── Emergency: Please speak slowly ───────────────────────────────────
  ('39772f39-df57-42fa-b84d-80b6e84e0c2f','te','Sare','సరే'),
  ('6b337336-eb1c-4e00-8c28-ba4218a25d80','te','Nenu mellaga maatlaadataanu','నేను మెల్లగా మాట్లాడతాను'),
  ('02573ab2-ce9c-4935-83ef-7cb1b5359793','te','Cheppandi','చెప్పండి'),

  -- ── Nurse: Please sit here ────────────────────────────────────────────
  ('469291d1-0b67-450f-b1b9-1ec373991bab','te','Sare','సరే'),
  ('9a641f71-97d2-417c-b6d4-a6e393383e4b','te','Nenu akkada koorchovachaa?','నేను అక్కడ కూర్చోవచ్చా?'),
  ('870b6015-3542-44b2-89a2-14240d144f92','te','Nenu koorchuuntaanu','నేను కూర్చుంటాను'),

  -- ── Nurse: Please wait ───────────────────────────────────────────────
  ('4855beaa-15bc-414a-88b0-08ac78cc1477','te','Sare, nenu vechi untaanu','సరే, నేను వేచి ఉంటాను'),
  ('91da37e3-db65-4b5a-abfe-b69b7967f197','te','Enta sepu?','ఎంత సేపు?'),
  ('bb7b4aa4-0f3a-4817-b5e0-f1d9534f7622','te','Nannnu call cheyyandi','నన్ను call చేయండి'),

  -- ── Nurse: What problem do you have? ─────────────────────────────────
  ('b7875552-8ba6-42a3-8b14-c7dac9c56e26','te','Naku jvaram undi','నాకు జ్వరం ఉంది'),
  ('26d40193-cee7-40b6-8310-d024af7e5600','te','Naku noppi undi','నాకు నొప్పి ఉంది'),
  ('1955fe8b-94c8-4eb9-a9aa-9e2f131c729a','te','Naku balaheenanga undi','నాకు బలహీనంగా ఉంది'),

  -- ── Nurse: Do you have fever? ────────────────────────────────────────
  ('4b29da1b-ecfe-4642-913c-d0d7e6c328f4','te','Avunu','అవును'),
  ('cd82548f-9e01-439f-8ef1-f99a5dae9cb5','te','Ledu','లేదు'),
  ('e2ddadf4-0198-412c-b104-037858afd852','te','Udayam nundi','ఉదయం నుండి'),

  -- ── Nurse: Do you have pain? ─────────────────────────────────────────
  ('8eb2fa75-1d14-436f-9dbf-783ed9e4fb27','te','Avunu, chaalaa noppi','అవును, చాలా నొప్పి'),
  ('a74c9bb9-5fa0-4e22-96be-c8acce4b08bb','te','Koddiga noppi','కొద్దిగా నొప్పి'),
  ('930d59fe-91ff-4401-9483-4ce725da2198','te','Noppi ledu','నొప్పి లేదు'),

  -- ── Nurse: I will check BP ───────────────────────────────────────────
  ('3e5a6185-46ca-4025-8560-eca5d8af62ee','te','Sare','సరే'),
  ('7177d5e5-9bb0-43d9-82f3-426a7bfa8522','te','Ippoode check cheyyandi','ఇప్పుడే check చేయండి'),
  ('115f0f8d-7edf-45c6-bbd9-9caf2bc4aa4d','te','Normal gaa undaa?','Normal గా ఉందా?'),

  -- ── Nurse: Please take this medicine ─────────────────────────────────
  ('446323d2-6324-4159-8534-5954a4de44e5','te','Enni saarluu?','ఎన్ని సార్లు?'),
  ('eba965ee-2433-4d56-a634-c7b67b7c64a0','te','Tinavadaaniki mundu ledaa tarvata?','తినడానికి ముందు లేదా తర్వాత?'),
  ('c261bc3e-9daf-45ba-8d0a-3f4497d7b588','te','Sare, teesukuntaanu','సరే, తీసుకుంటాను'),

  -- ── Nurse: Follow me ─────────────────────────────────────────────────
  ('c4a799b9-0268-4f93-ab42-c9d221de2101','te','Sare','సరే'),
  ('91a19d68-f39a-4026-b848-fc5496706202','te','Ekkadiki vellaali?','ఎక్కడికి వెళ్ళాలి?'),
  ('491c8a19-401e-45fc-a2c3-c053cd994f1a','te','Nenu vasthunnaanu','నేను వస్తున్నాను'),

  -- ── Nurse: Doctor will come soon ─────────────────────────────────────
  ('bbc89beb-ca9d-402a-9a0a-6d66f64fdbcb','te','Sare','సరే'),
  ('b912573f-5702-4e6d-b2f4-8c2b551521de','te','Veganga pilavandi','వేగంగా పిలవండి'),
  ('c9258773-be2f-4128-8d30-92593890417f','te','Nenu vechi untaanu','నేను వేచి ఉంటాను'),

  -- ── Nurse: Emergency case, come fast ─────────────────────────────────
  ('3e5cab37-9e92-4e46-ad1f-51f01a81088f','te','Ippoode vasthunnaanu','ఇప్పుడే వస్తున్నాను'),
  ('9a50a5b0-b683-48c8-b8a0-aa7c6053cbe4','te','Doctor ni pilavandi','డాక్టర్ని పిలవండి'),
  ('68e14a6f-4823-4980-8683-bf028cd07db4','te','Stretcher teesuku randi','Stretcher తీసుకు రండి'),

  -- ── Doctor: What symptoms do you have? ───────────────────────────────
  ('a374bd02-2982-4219-8dce-969bd511c4a4','te','Jvaram mariyu daggu','జ్వరం మరియు దగ్గు'),
  ('f3d9b7ce-3aed-4f2c-b184-bb0fc8d7d396','te','Talanoppi','తలనొప్పి'),
  ('a577cfa5-b660-4e78-aee7-a6b912e52abd','te','Kadupunoppi','కడుపు నొప్పి'),

  -- ── Doctor: Since when do you have this? ─────────────────────────────
  ('23683f12-cf46-4348-8984-c0a070800597','te','Ninnatinundi','నిన్నటి నుండి'),
  ('d69527ac-afaa-4b02-83cf-a7c2cb43c925','te','Udayam nundi','ఉదయం నుండి'),
  ('36a3de8d-dd72-49b8-96ef-36dea0db3a70','te','3 rojula nundi','3 రోజుల నుండి'),

  -- ── Doctor: Do you have allergy? ─────────────────────────────────────
  ('8b052b5e-cf8f-4296-8e5e-a7de18e7f88f','te','Avunu','అవును'),
  ('7d7344ae-915a-4b41-9f5a-52dce9fe1f0d','te','Ledu','లేదు'),
  ('64bb5f3f-1c58-4c50-9f8f-384016068509','te','Teliyadhu','తెలియదు'),

  -- ── Doctor: I will examine you ───────────────────────────────────────
  ('3e38b20c-a682-402e-8dec-1b09165de733','te','Sare doctor','సరే డాక్టర్'),
  ('5fe6f697-954e-413c-926f-42ce20ae6550','te','Jaagrattagaa check cheyyandi','జాగ్రత్తగా check చేయండి'),
  ('88046732-0af6-449b-8139-26a6d1deb1f4','te','Naku teevranga noppi undi','నాకు తీవ్రంగా నొప్పి ఉంది'),

  -- ── Doctor: You need a blood test ────────────────────────────────────
  ('1436de0d-5be5-4b5b-98f8-d69aade70739','te','Test ekkada cheyyaali?','Test ఎక్కడ చేయాలి?'),
  ('ddbdcadb-20ac-4bef-9c82-e72af8f80441','te','Nenu ippudu cheyyavachaa?','నేను ఇప్పుడు చేయవచ్చా?'),
  ('21183c62-4d58-4927-834d-f17150db6907','te','Sare, nenu chestaanu','సరే, నేను చేస్తాను'),

  -- ── Doctor: Take this medicine twice daily ────────────────────────────
  ('1649b54d-8331-4b90-a7d8-4866b5d47f53','te','Tinavadaaniki mundu ledaa tarvata?','తినడానికి ముందు లేదా తర్వాత?'),
  ('e5c319a8-8e7a-405d-bdc4-129f728c3b55','te','Enni rojulu?','ఎన్ని రోజులు?'),
  ('262789b6-671a-44c0-bcad-616d3d8d8ed6','te','Sare doctor','సరే డాక్టర్'),

  -- ── Doctor: No need to worry ─────────────────────────────────────────
  ('78c1bb9e-221c-4d7d-af45-fc0208aaab8a','te','Dhanyavaadalu doctor','ధన్యవాదాలు డాక్టర్'),
  ('fae17a7d-e411-49be-9d9d-c4d78917432b','te','Nenu tvaragaa kolukuntaanaa?','నేను త్వరగా కోలుకుంటానా?'),
  ('b554a00b-93e2-4e75-b881-208a98b8fe2e','te','Naku bhayangaa undi','నాకు భయంగా ఉంది'),

  -- ── Doctor: You need rest ─────────────────────────────────────────────
  ('3f5754fa-8209-45b0-b2a5-c5fcad053686','te','Enni rojulu rest?','ఎన్ని రోజులు rest?'),
  ('ce5e139f-7834-4e53-af28-4e15c3ae2806','te','Nenu office ki vellavachaa?','నేను office కి వెళ్ళవచ్చా?'),
  ('d04c61e5-2fb1-415c-b94d-df5d3c1dc803','te','Sare, nenu rest teesukuntaanu','సరే, నేను rest తీసుకుంటాను'),

  -- ── Doctor: Come for review tomorrow ─────────────────────────────────
  ('e991a29d-caac-4750-ae02-6e3b0b79c85b','te','Enta samayaaniki?','ఎంత సమయానికి?'),
  ('3a116fff-54f1-4436-b81a-ae19e601d370','te','Sare, nenu vastaanu','సరే, నేను వస్తాను'),
  ('15a3e609-f148-4943-aca8-f6ce4a955f25','te','Saayantram ravaachaa?','సాయంత్రం రావచ్చా?'),

  -- ── Doctor: Admit in hospital ────────────────────────────────────────
  ('dcd131fb-af47-4c29-8678-4c2c7c5aa724','te','Teevranga undaa?','తీవ్రంగా ఉందా?'),
  ('51520a0f-ee17-4a3e-b3ba-ee8354abd56c','te','Sare, admit chestaanu','సరే, admit చేస్తాను'),
  ('47da550b-9f0c-4265-9742-b43e3de4c2e0','te','Naa kutumbaaniki cheppandi','నా కుటుంబానికి చెప్పండి'),

  -- ── Software Engineer: Let's start the meeting ────────────────────────
  ('62cc43a6-199d-42cb-b61f-67a9b1679d84','te','Avunu, modaledutunnaanu','అవును, మొదలెడుతున్నాను'),
  ('61057379-c635-4f3c-999e-67450762909d','te','2 nimishaalu ivvandi','2 నిమిషాలు ఇవ్వండి'),
  ('41022d88-6171-44e8-b178-8735edbee86c','te','Ippoode join avutunnaanu','ఇప్పుడే join అవుతున్నాను'),

  -- ── Software Engineer: Can you share the update? ──────────────────────
  ('cab324b8-cb91-4a71-be05-9f5eba4e0b22','te','Chat lo share chesaanu','Chat లో share చేశాను'),
  ('46b66d9a-6449-499d-9036-8c1747a63c09','te','Ippoode share chestaanu','ఇప్పుడే share చేస్తాను'),
  ('53749750-7443-4592-af71-aab8cff3c56f','te','Inkaa pani chestaanu','ఇంకా పని చేస్తున్నాను'),

  -- ── Software Engineer: Please check this issue ───────────────────────
  ('37556b48-2cb4-4cc4-8d0b-0862650103cb','te','Sare, check chestaanu','సరే, check చేస్తున్నాను'),
  ('242aa26b-31ba-46d1-ab43-3af826d7b557','te','Logs share cheyyagalaraa?','Logs share చేయగలరా?'),
  ('515a2d70-3810-485a-b05b-b55b70158af0','te','Nenu reproduce cheyyagalanu','నేను reproduce చేయగలను'),

  -- ── Software Engineer: This is blocked ───────────────────────────────
  ('68086a9d-064a-4f0b-9b8d-4128f894b047','te','Edi block chesindi?','ఏది block చేసింది?'),
  ('70f17544-f476-42a4-a01a-98e48077347b','te','Dependency kaavali','Dependency కావాలి'),
  ('9c0e74b0-f233-46d0-9bc6-b29be7f94867','te','Lead ki escalate cheyyandi','Lead కి escalate చేయండి'),

  -- ── Software Engineer: I need access ─────────────────────────────────
  ('3758be90-c23e-4292-836c-bbe3ad8e74bd','te','Nenu access istaanu','నేను access ఇస్తాను'),
  ('4c0ac084-49a2-4728-be1c-e237d2886c02','te','Request pampandi','Request పంపండి'),
  ('404e8c5b-5403-49d5-9ff0-5ff40965ff82','te','Approval kosam vechi unnaanu','Approval కోసం వేచి ఉన్నాను'),

  -- ── Software Engineer: I will fix and update ─────────────────────────
  ('8d4ee657-faf8-468c-945e-5890b46f9bf7','te','Sare, dhanyavaadalu','సరే, ధన్యవాదాలు'),
  ('80bde787-244e-42eb-aadc-2b45d4caf296','te','Enta samayaaniki?','ఎంత సమయానికి?'),
  ('1b7fec01-2c69-4354-a4df-b64e139b735c','te','Channel lo post cheyyandi','Channel లో post చేయండి'),

  -- ── Software Engineer: Please review my code ─────────────────────────
  ('a3f59856-714a-4e0b-a6ac-8ec041eccef4','te','Tappakunda, nenu review chestaanu','తప్పకుండా, నేను review చేస్తాను'),
  ('282ebe9a-2b3a-4dcd-ac49-ba0e4432e639','te','PR create cheyyandi','PR create చేయండి'),
  ('8ebe043c-54a2-4261-a407-d7a848fcd467','te','Nenu comments cherchaanu','నేను comments చేర్చాను'),

  -- ── Software Engineer: Can we deploy today? ──────────────────────────
  ('9fc6057b-bfc4-4c18-9656-283675568df0','te','Avunu, deploy ki ready','అవును, deploy కి ready'),
  ('651e343b-e830-4528-8b47-960969971d0d','te','Inkaa oka test kaavali','ఇంకా ఒక test కావాలి'),
  ('b676ad89-f0de-421d-9372-61df17c2cbfb','te','Repu deploy cheddaam','రేపు deploy చేద్దాం'),

  -- ── Software Engineer: I need more time ──────────────────────────────
  ('15f83372-669a-4473-833e-8f0b53aa0c47','te','Sare, time teesukundi','సరే, time తీసుకోండి'),
  ('91e343b3-82e1-4587-a2bf-867cef22d644','te','Enta samayam?','ఎంత సమయం?'),
  ('1ca7f4fc-b1f9-42ba-8fc8-1cddd1a70273','te','Priority ivvandi','Priority ఇవ్వండి'),

  -- ── Software Engineer: Task is completed ─────────────────────────────
  ('75f42ade-236c-4261-9143-09213e7d3446','te','Chaalaa baagaa chesaaru','చాలా బాగా చేశారు'),
  ('1566c9b7-cef4-41eb-bc2b-cc3c2bfaad2b','te','Tarvata task ki vellandi','తర్వాత task కి వెళ్ళండి'),
  ('db945292-dee8-4932-bd77-0e060a1d1c82','te','Ticket close cheyyandi','Ticket close చేయండి')

on conflict (reply_id, language_code)
do update set
  phonetic_text = excluded.phonetic_text,
  native_text   = excluded.native_text;
