require('dotenv').config();
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    token_uri: "https://oauth2.googleapis.com/token",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample test datasets
const gsm8kTestData = [
    {
        question: "Janet's ducks lay 16 eggs per day. She eats three for breakfast every morning and sells the rest at the farmers market daily for $2 per egg. How much in dollars does she make per week?",
        answer: "Let's solve this step by step:\n1) First, let's calculate how many eggs Janet has to sell each day:\n   * Daily eggs = 16\n   * Eaten eggs = 3\n   * Eggs for sale = 16 - 3 = 13 eggs\n2) Now, let's calculate daily revenue:\n   * Price per egg = $2\n   * Daily revenue = 13 × $2 = $26\n3) Finally, let's calculate weekly revenue:\n   * Weekly revenue = $26 × 7 = $182\nThe answer is 182"
    },
    {
        question: "A contractor quotes a job at $2,340. He figures his costs will be $1,170 for materials, $450 for labor, and 20% of the quote for overhead. How much profit will he make?",
        answer: "Let's solve this step by step:\n1) First, let's calculate the overhead cost:\n   * Quote = $2,340\n   * Overhead = 20% of $2,340\n   * Overhead = $2,340 × 0.20 = $468\n2) Now, let's add up all costs:\n   * Materials = $1,170\n   * Labor = $450\n   * Overhead = $468\n   * Total costs = $1,170 + $450 + $468 = $2,088\n3) Finally, let's calculate profit:\n   * Profit = Quote - Total costs\n   * Profit = $2,340 - $2,088 = $252\nThe answer is 252"
    },
    {
        question: "In a class of 30 students, 40% are boys. If 3 more boys join the class, what percentage of the class will be boys?",
        answer: "Let's solve this step by step:\n1) First, let's calculate the current number of boys:\n   * Total students = 30\n   * Boys percentage = 40%\n   * Current boys = 30 × 40% = 12 boys\n2) Now, let's add 3 more boys:\n   * New number of boys = 12 + 3 = 15 boys\n   * New total students = 30 + 3 = 33 students\n3) Calculate new percentage:\n   * New percentage = (15 ÷ 33) × 100 = 45.45...\nThe answer is 45"
    },
    {
        question: "A store offers a 20% discount on a $80 shirt. During a special sale, they offer an additional 10% off the discounted price. What is the final price of the shirt?",
        answer: "Let's solve this step by step:\n1) First, calculate the price after 20% discount:\n   * Original price = $80\n   * First discount = 20% of $80 = $16\n   * Price after first discount = $80 - $16 = $64\n2) Then calculate the additional 10% off:\n   * Second discount = 10% of $64 = $6.40\n   * Final price = $64 - $6.40 = $57.60\nThe answer is 58"
    },
    {
        question: "If it takes 6 workers 7 hours to paint a house, how many hours would it take 14 workers to paint the same house?",
        answer: "Let's solve this step by step:\n1) First, calculate the total work hours:\n   * Workers × Hours = 6 × 7 = 42 total work hours\n2) With 14 workers:\n   * 42 ÷ 14 = 3 hours\nThe answer is 3"
    }
];

const mmluTestData = [
    {
        question: "What is the value of x in the equation 2x + 5 = 13?",
        choices: ["2", "4", "6", "8"],
        answer: 1  // Index 1 corresponds to "4"
    },
    {
        question: "If a triangle has angles measuring 45°, 45°, and 90°, what is the ratio of its shortest to its longest side?",
        choices: ["1:√2", "1:2", "2:3", "1:3"],
        answer: 0  // Index 0 corresponds to "1:√2"
    },
    {
        question: "What is the area of a circle with radius 5 units?",
        choices: ["25π", "10π", "15π", "20π"],
        answer: 0  // Index 0 corresponds to "25π"
    },
    {
        question: "If f(x) = x² - 4x + 3, what is f(2)?",
        choices: ["-1", "0", "1", "3"],
        answer: 0  // Index 0 corresponds to "-1"
    },
    {
        question: "What is the slope of a line perpendicular to y = 3x + 2?",
        choices: ["3", "-3", "-1/3", "1/3"],
        answer: 2  // Index 2 corresponds to "-1/3"
    }
];

// Add coding test dataset
const codingTestData = [
    {
        question: "Write a function in Python that takes a list of numbers and returns the sum of all even numbers in the list.",
        test_cases: [
            { input: "[1, 2, 3, 4, 5, 6]", expected: "12" },
            { input: "[2, 4, 6, 8]", expected: "20" },
            { input: "[1, 3, 5, 7]", expected: "0" }
        ],
        answer: `def sum_even_numbers(numbers):
    return sum(num for num in numbers if num % 2 == 0)`
    },
    {
        question: "Write a function in Python that checks if a string is a palindrome (reads the same forwards and backwards), ignoring spaces and case.",
        test_cases: [
            { input: "'A man a plan a canal Panama'", expected: "True" },
            { input: "'race a car'", expected: "False" },
            { input: "'Was it a car or a cat I saw'", expected: "True" }
        ],
        answer: `def is_palindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]`
    },
    {
        question: "Write a function in Python that finds the first non-repeating character in a string and returns its index. If there is no non-repeating character, return -1.",
        test_cases: [
            { input: "'leetcode'", expected: "0" },
            { input: "'loveleetcode'", expected: "2" },
            { input: "'aabb'", expected: "-1" }
        ],
        answer: `def first_unique_char(s):
    from collections import Counter
    count = Counter(s)
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    return -1`
    },
    {
        question: "Write a function in Python that implements the binary search algorithm to find a target number in a sorted list. Return the index if found, otherwise return -1.",
        test_cases: [
            { input: "nums=[-1,0,3,5,9,12], target=9", expected: "4" },
            { input: "nums=[-1,0,3,5,9,12], target=2", expected: "-1" },
            { input: "nums=[1], target=1", expected: "0" }
        ],
        answer: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    {
        question: "Write a function in Python that converts a number to its Roman numeral representation. The number will be between 1 and 3999.",
        test_cases: [
            { input: "3", expected: "'III'" },
            { input: "58", expected: "'LVIII'" },
            { input: "1994", expected: "'MCMXCIV'" }
        ],
        answer: `def int_to_roman(num):
    values = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
    numerals = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
    result = ""
    for i, value in enumerate(values):
        while num >= value:
            result += numerals[i]
            num -= value
    return result`
    }
];

// Add multimodal test datasets
const visualTestData = [
    {
        question: "What is shown in this image? Describe the main elements you see.",
        image_url: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/dog.png",
        answer: "A dog sitting or lying down"
    },
    {
        question: "What is shown in this image? Describe what you see in detail.",
        image_url: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/cat.png",
        answer: "A cat sitting or resting"
    },
    {
        question: "What is shown in this image? Describe the scene.",
        image_url: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/car.png",
        answer: "A car parked or driving on a road"
    },
    {
        question: "What is shown in this image? Describe the environment.",
        image_url: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/house.png",
        answer: "A house or building structure"
    },
    {
        question: "What is shown in this image? Describe what you observe.",
        image_url: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/tree.png",
        answer: "A tree or plant in nature"
    }
];

const audioTestData = [
    {
        question: "What is being said in this audio clip?",
        audio_url: "https://example.com/audio1.mp3",
        answer: "The quick brown fox jumps over the lazy dog"
    },
    {
        question: "What is the main sound in this audio?",
        audio_url: "https://example.com/audio2.mp3",
        answer: "A piano playing classical music"
    },
    {
        question: "Identify the language being spoken.",
        audio_url: "https://example.com/audio3.mp3",
        answer: "English"
    }
];

const textUnderstandingData = [
    {
        question: "Summarize the following text:\nThe Industrial Revolution was a period of major industrialization and innovation during the late 18th and early 19th centuries. The Industrial Revolution began in Great Britain and quickly spread throughout Europe and the United States.",
        answer: "The Industrial Revolution was a time of significant industrial and technological advancement in the late 18th and early 19th centuries, starting in Britain and expanding to Europe and the US."
    },
    {
        question: "What is the main idea of this text:\nArtificial Intelligence has transformed various sectors, from healthcare to transportation. While it offers numerous benefits, concerns about privacy and job displacement remain.",
        answer: "AI has widespread impact across industries, bringing benefits but also raising concerns about privacy and employment."
    }
];

const integrationTestData = [
    {
        question: "Look at this image and answer the question: What time of day is it and what's the weather like?",
        image_url: "https://raw.githubusercontent.com/microsoft/unilm/master/beit3/assets/demo/image/000000000544.jpg",
        audio_url: "https://example.com/weather_question.mp3",
        answer: "It appears to be a sunny afternoon based on the lighting in the image"
    },
    {
        question: "Based on the image and audio description, what activity is taking place?",
        image_url: "https://raw.githubusercontent.com/microsoft/unilm/master/beit3/assets/demo/image/000000000785.jpg",
        audio_url: "https://example.com/activity_description.mp3",
        answer: "Surfing on ocean waves"
    }
];

async function checkModelEvaluationStatus(modelId, modelType) {
    try {
        const collectionName = modelType === 'Large Language' ? 'language-model-rankings' : 'multimodal-model-rankings';
        const doc = await db.collection(collectionName).doc(modelId).get();
        
        if (!doc.exists) return false;
        
        const data = doc.data();
        if (!data) return false;

        // Check if all scores are 0 or undefined
        const scores = modelType === 'Large Language' 
            ? ['mathematics', 'coding', 'knowledge_usage', 'organization']
            : ['visual_recognition', 'audio_processing', 'text_understanding', 'integration'];
        
        return scores.some(field => (data[field] || 0) > 0);
    } catch (error) {
        console.error("Error checking evaluation status:", error);
        return false;
    }
}

async function evaluateExample(model, prompt) {
    try {
        // 构建请求体，区分纯文本和多模态
        const requestBody = {
            model: model.model_name,
            stream: false,
            max_tokens: 512,
            stop: ["null"],
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            frequency_penalty: 0.5,
            n: 1,
            response_format: { type: "text" }
        };

        // 根据模型类型和输入类型设置不同的消息格式
        if (model.model_type === 'Multimodal') {
            // 多模态模型的请求格式
            requestBody.messages = [{
                role: 'user',
                content: Array.isArray(prompt.content) ? prompt.content : [
                    {
                        type: 'text',
                        text: prompt
                    }
                ]
            }];
        } else {
            // 纯文本模型的请求格式
            requestBody.messages = [{
                role: 'user',
                content: prompt
            }];
        }

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${model.api_token || ''}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        // 使用模型的 API URL
        const apiUrl = model.api_url;
        if (!apiUrl) {
            throw new Error('Model API URL is not defined');
        }

        console.log(`Making API request to: ${apiUrl}`);
        console.log('Request data:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(apiUrl, options);
        
        if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }
            return '';
        } else {
            console.error(`API request failed with status code: ${response.status}`);
            console.error('Response content:', await response.text());
            return '';
        }
    } catch (error) {
        console.error('Error in example evaluation:', error);
        console.error('Model data:', JSON.stringify(model, null, 2));
        return '';
    }
}

async function evaluateMultimodalModel(model) {
    try {
        console.log(`\nEvaluating multimodal model: ${model.model_name || 'Unknown'}`);

        // Initialize scores
        const scores = {
            visual_recognition: 0,
            text_understanding: 0,
            integration: 0
        };

        // Evaluate visual recognition
        console.log("\nEvaluating visual recognition capability...");
        let totalVisual = 0;
        let correctVisual = 0;

        for (const example of visualTestData) {
            try {
                const response = await evaluateExample(
                    model,
                    {
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: example.image_url,
                                    detail: "auto"
                                }
                            },
                            {
                                type: 'text',
                                text: example.question
                            }
                        ]
                    }
                );
                console.log("\nModel response:", response);

                // Simple semantic similarity check
                const similarity = calculateSimilarity(response.toLowerCase(), example.answer.toLowerCase());
                if (similarity > 0.5) { // Lower threshold for more flexible matching
                    correctVisual++;
                }
                totalVisual++;
            } catch (error) {
                console.error("Error in visual evaluation:", error);
            }
        }

        scores.visual_recognition = totalVisual > 0 ? correctVisual / totalVisual : 0;
        scores.overall_score = scores.visual_recognition; // Only use visual recognition score

        // Update rankings in Firebase
        await db.collection('multimodal-model-rankings').doc(model.id).set({
            model_id: model.id,
            model_name: model.model_name,
            overall_score: scores.overall_score,
            visual_recognition: scores.visual_recognition,
            audio_processing: 0,
            text_understanding: 0,
            integration: 0,
            progress: 1.0,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log("\nMultimodal evaluation completed. Scores:", JSON.stringify(scores, null, 2));
        return scores;
    } catch (error) {
        console.error("Error in multimodal evaluation process:", error);
        throw error;
    }
}

// Helper function to calculate text similarity
function calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
}

async function evaluateModel(model) {
    if (model.model_type === 'Multimodal') {
        return evaluateMultimodalModel(model);
    } else {
        // Language model evaluation
        try {
            console.log(`\nEvaluating language model: ${model.model_name || 'Unknown'}`);

            // Initialize scores
            const scores = {
                mathematics: 0,
                coding: 0,
                knowledge_usage: 0,
                organization: 0
            };

            // Evaluate mathematics capability
            console.log("\nEvaluating mathematics capability...");
            let totalMath = 0;
            let correctMath = 0;

            for (const example of gsm8kTestData) {
                try {
                    const response = await evaluateExample(
                        model,
                        `Solve this math problem step by step and provide the final answer as a number:\n\n${example.question}`
                    );
                    console.log("\nModel response:", response);

                    const numbers = response.match(/\d+/g) || [];
                    const predictedAnswer = numbers[numbers.length - 1];
                    const answerNumbers = example.answer.match(/\d+/g) || [];
                    const correctAnswer = answerNumbers[answerNumbers.length - 1];

                    if (predictedAnswer && correctAnswer && predictedAnswer === correctAnswer) {
                        correctMath++;
                    }
                    totalMath++;
                } catch (error) {
                    console.error("Error in math evaluation:", error);
                }
            }

            scores.mathematics = totalMath > 0 ? correctMath / totalMath : 0;

            // Evaluate coding capability
            console.log("\nEvaluating coding capability...");
            let totalCoding = 0;
            let correctCoding = 0;

            for (const example of codingTestData) {
                try {
                    const response = await evaluateExample(
                        model,
                        `Write a Python function to solve this problem. Only provide the function implementation, no explanations:\n\n${example.question}`
                    );
                    console.log("\nModel response:", response);

                    // Extract the function definition from the response
                    const functionMatch = response.match(/def\s+[\w_]+\s*\([^)]*\):\s*[\s\S]*?(?=\n\s*\n|$)/);
                    if (functionMatch) {
                        const functionCode = functionMatch[0];
                        
                        // Check if the function contains the core logic from the answer
                        const answerLines = example.answer.split('\n')
                            .map(line => line.trim())
                            .filter(line => line && !line.startsWith('def'));
                            
                        const responseLines = functionCode.split('\n')
                            .map(line => line.trim())
                            .filter(line => line && !line.startsWith('def'));

                        // Check if all core logic lines from the answer appear in the response
                        const hasAllLogic = answerLines.every(line => 
                            responseLines.some(respLine => 
                                respLine.replace(/\s+/g, '') === line.replace(/\s+/g, '')
                            )
                        );

                        if (hasAllLogic) {
                            correctCoding++;
                        }
                    }
                    totalCoding++;
                } catch (error) {
                    console.error("Error in coding evaluation:", error);
                }
            }

            scores.coding = totalCoding > 0 ? correctCoding / totalCoding : 0;

            // Evaluate knowledge usage
            console.log("\nEvaluating knowledge usage...");
            let totalKnowledge = 0;
            let correctKnowledge = 0;

            for (const example of mmluTestData) {
                try {
                    const formattedPrompt = `Answer this high school mathematics question by selecting ONLY ONE LETTER (A, B, C, or D).
Question: ${example.question}
Choices:
${example.choices.map((choice, i) => `${String.fromCharCode(65 + i)}. ${choice}`).join('\n')}
Answer:`;

                    const response = await evaluateExample(model, formattedPrompt);
                    console.log("\nModel response:", response);

                    const answerMatch = response.toUpperCase().match(/[ABCD]/);
                    if (answerMatch) {
                        const predictedAnswer = answerMatch[0];
                        const correctAnswer = String.fromCharCode(65 + example.answer);
                        if (predictedAnswer === correctAnswer) {
                            correctKnowledge++;
                        }
                    }
                    totalKnowledge++;
                } catch (error) {
                    console.error("Error in knowledge evaluation:", error);
                }
            }

            scores.knowledge_usage = totalKnowledge > 0 ? correctKnowledge / totalKnowledge : 0;
            

            // Calculate overall score
            scores.overall_score = (scores.mathematics + scores.coding + scores.knowledge_usage) / 3;
            
            // Update rankings in Firebase
            await db.collection('language-model-rankings').doc(model.id).set({
                model_id: model.id,
                model_name: model.model_name,
                overall_score: scores.overall_score,
                mathematics: scores.mathematics,
                knowledge_usage: scores.knowledge_usage,
                coding: scores.coding,
                organization: scores.organization,
                progress: 1.0,
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("\nLanguage model evaluation completed. Scores:", JSON.stringify(scores, null, 2));
            return scores;
        } catch (error) {
            console.error("Error in language model evaluation process:", error);
            throw error;
        }
    }
}

async function evaluateAllModels() {
    try {
        console.log("\nFetching models from Firebase...");
        const modelsToEvaluate = [];

        // Fetch and check language models
        const langModelsSnapshot = await db.collection('language-models').get();
        for (const model of langModelsSnapshot.docs) {
            const needsEvaluation = !(await checkModelEvaluationStatus(model.id, 'Large Language'));
            if (needsEvaluation) {
                const data = { ...model.data(), id: model.id, model_type: 'Large Language' };
                modelsToEvaluate.push(data);
            }
        }

        // Fetch and check multimodal models
        const multiModelsSnapshot = await db.collection('multimodal-models').get();
        for (const model of multiModelsSnapshot.docs) {
            const needsEvaluation = !(await checkModelEvaluationStatus(model.id, 'Multimodal'));
            if (needsEvaluation) {
                const data = { ...model.data(), id: model.id, model_type: 'Multimodal' };
                modelsToEvaluate.push(data);
            }
        }

        if (modelsToEvaluate.length === 0) {
            console.log("No models need evaluation at this time");
            return;
        }

        console.log(`Found ${modelsToEvaluate.length} models that need evaluation`);
        
        // Evaluate each model that needs evaluation
        for (const model of modelsToEvaluate) {
            await evaluateModel(model);
        }

        console.log("\nAll model evaluations completed");
    } catch (error) {
        console.error("Error in evaluation process:", error);
        throw error;
    }
}

module.exports = {
    evaluateAllModels,
    evaluateModel,
    checkModelEvaluationStatus,
    evaluateExample
}; 