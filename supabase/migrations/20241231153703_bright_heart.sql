@@ .. @@
   setup TEXT,
   notes TEXT,
   entry_screenshot TEXT,
   exit_screenshot TEXT,
+  balance_before_trade DECIMAL(15,2) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
 );