import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
    timetableMake: defineAction({
        input: z.object({
            timetable: z.string(),
        }),
        handler: async (input) => {
            const token = import.meta.env.HCAI;

            try {
                const response = await fetch('https://ai.hackclub.com/proxy/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-4-argon',
                        messages: [
                            {
                                role: 'user',
                                content: `You are a data extraction assistant. Your job is to analyze the input data and format it into JSON.

                                Timetable Data to Process:
                                ${input.timetable}

                                CRITICAL REQUIREMENT: You must return ONLY a valid JSON object matching the schema below. 
                                Do NOT include any conversational text, introductions, or markdown formatting blocks (like \`\`\`json). Return raw text only.

                                Desired JSON Schema Example:
                                {
                                    "monday": ["Subject 1", "Subject 2"],
                                    "tuesday": ["Subject 1", "Subject 2"],
                                    "wednesday": ["Subject 1", "Subject 2"],
                                    "thursday": ["Subject 1", "Subject 2"],
                                    "friday": ["Subject 1", "Subject 2"]
                                }

                                Instructions:
                                1. Carefully trace the timetable grid column by column for each day (Monday through Friday).
                                2. For each day, gather all the subject names taught on that day.
                                3. Exclude empty intervals, breaks, or lunch periods. 
                                4. If a subject appears multiple times on the same day, condense it so it only appears ONCE in that day's array.
                                5. If the provided text is not a timetable, return the structure with the string "Something went wrong, please try again!" inside the arrays.
                                6. DEDUPLICATION RULE: Treat the array for each day as a strict set. A subject name must only appear ONCE per day. If a subject is seen multiple times within the same day's section, discard the duplicates.`
                            }
                        ],
                        max_tokens: 9000
                    }),
                });

                const result = await response.json();
                if (!result.choices || !result.choices[0]) {
                    throw new Error(result.error?.message || ":3");
                }

                const content = result.choices[0].message.content;

                return content;
            } catch (e) {
                console.error("Action error:", e);
                return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
            }
        }
    })
};
