import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Public by design — protected by RLS, not secrecy. See the
// create_rooms_and_entries migration for the (intentionally open,
// invite-code-only) access model.
const SUPABASE_URL = 'https://gdeabwwrvioczogydclm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tHpzFP2QcDx7SfYnxgbtkg_u7MfE4Fy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
