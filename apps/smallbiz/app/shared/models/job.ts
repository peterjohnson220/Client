export interface Job {
    id: string;
    title: string;
    description: string;
    code: string;
    family: string;
    level: string;
    effectiveDate: Date;
    nationalBaseAverage: number;
    nationalBase25: number;
    nationalBase50: number;
    nationalBase75: number;
    nationalTccAverage: number;
    nationalTcc25: number;
    nationalTcc50: number;
    nationalTcc75: number;
}
