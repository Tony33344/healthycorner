-- Set admin role for the admin user
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@healthycorner.com';

-- Verify the update
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'admin@healthycorner.com';
