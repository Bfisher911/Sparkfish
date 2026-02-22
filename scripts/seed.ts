import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Seeding tracks...');
    const { data: tracks, error: tracksError } = await supabase.from('tracks').upsert([
        { slug: 'business-productivity', title: 'Business Productivity Track', description: 'AI fundamentals, workflow automation, and responsible AI use across all industries.' },
        { slug: 'healthcare', title: 'Healthcare Track', description: 'Safe use patterns, privacy mindset, documentation support, and operational workflows in healthcare.' },
        { slug: 'education-faculty', title: 'Education and Faculty Track', description: 'Course design, grading workflows, AI literacy for students, and academic integrity.' }
    ], { onConflict: 'slug' }).select();
    if (tracksError) throw tracksError;

    console.log('Seeding programs...');
    const { data: programs, error: progError } = await supabase.from('programs').upsert([
        {
            slug: 'six-month',
            title: 'Six-Month AI Accelerator',
            description: 'Comprehensive, weekends over Zoom, live sessions. Covers fundamentals through advanced prompting and workflows.',
            type: 'six_month',
            active: true
        },
        {
            slug: 'twelve-month',
            title: 'Twelve-Month AI Fellowship',
            description: 'Deeper exploration of AI strategy. Includes a capstone project and advanced implementation outcomes.',
            type: 'twelve_month',
            active: true
        },
        {
            slug: 'ai-for-managers',
            title: 'AI for Managers Weekend Intensive',
            description: 'A 2-day intensive covering core managerial applications of AI models.',
            type: 'weekend_course',
            active: true
        },
        {
            slug: 'prompt-engineering-masterclass',
            title: 'Prompt Engineering Masterclass',
            description: 'Advanced prompting techniques for developers and content creators over one weekend.',
            type: 'weekend_course',
            active: true
        }
    ], { onConflict: 'slug' }).select();
    if (progError) throw progError;

    console.log('Seeding cohorts...');

    const getProgId = (slug: string) => programs.find(p => p.slug === slug)?.id;

    const cohortsToInsert = [
        {
            program_id: getProgId('six-month'),
            title: 'Fall 2026 Cohort',
            start_date: '2026-09-15',
            schedule_text: 'Saturdays, 10am - 12pm EST (6 months)',
            seat_limit: 50,
            zoom_url: 'https://zoom.us/j/sample123'
        },
        {
            program_id: getProgId('six-month'),
            title: 'Winter 2027 Cohort',
            start_date: '2027-01-15',
            schedule_text: 'Sundays, 1pm - 3pm EST (6 months)',
            seat_limit: 50,
            zoom_url: 'https://zoom.us/j/sample456'
        },
        {
            program_id: getProgId('twelve-month'),
            title: 'Fall 2026 Fellowship',
            start_date: '2026-09-01',
            schedule_text: 'Every other Saturday, 10am - 1pm EST (12 months)',
            seat_limit: 25,
            zoom_url: 'https://zoom.us/j/sample789'
        },
        {
            program_id: getProgId('ai-for-managers'),
            title: 'October Weekend Sprint',
            start_date: '2026-10-10',
            schedule_text: 'Oct 10-11, 10am - 4pm EST',
            seat_limit: 100,
            zoom_url: 'https://zoom.us/j/sample101'
        }
    ];

    for (const c of cohortsToInsert) {
        // Only insert if it doesn't closely exist
        const { data: existing } = await supabase.from('cohorts').select('id').eq('title', c.title).eq('program_id', c.program_id).single();
        if (!existing) {
            const { error } = await supabase.from('cohorts').insert([c]);
            if (error) throw error;
        }
    }

    console.log('Database seeded successfully!');
}

seed().catch(console.error);
