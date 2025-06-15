export interface TechnicalTerm {
    term: string;
    aliases?: string[];
    explanation: string;
    explanationKm?: string;
}

export const TECHNICAL_TERMS: TechnicalTerm[] = [
    {
        term: "technical terms",
        explanation: "Specialized vocabulary related to a specific field.",
        explanationKm: "ពាក្យ​ពេចន៍​ឯកទេស​ទាក់ទង​នឹង​វិស័យ​ជាក់លាក់។"
    },
    {
        term: "AI",
        aliases: ["Artificial Intelligence"],
        explanation: "Computer systems that can perform tasks that normally require human intelligence.",
        explanationKm: "ប្រព័ន្ធកុំព្យូទ័រដែលអាចបំពេញកិច្ចការដែលជាធម្មតាត្រូវការបញ្ញាមនុស្ស។"
    },
    // Add more technical terms as needed
]; 