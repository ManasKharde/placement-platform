const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

function cleanUrl(url) {
  if (!url) return url;
  const match = url.match(/\((https?:\/\/[^\s)]+)\)/);
  if (match) return match[1];
  return url.replace(/^\[|\]$/g, '').trim();
}

const LECTURES = [
  {
    slug: 'django-full-course-masterclass',
    title: 'Django Full Course | Beginner to Advanced',
    module_name: 'Django & REST API Framework',
    topic_order: 1,
    duration_minutes: 959, // 15h 59m
    video_url: 'https://youtu.be/iflSRpcyzdI',
    video_title: 'Django Full Course 2026 in Hindi | Beginner to Advanced | Projects + Interview Preparation',
    creator_name: 'Mohit Decodes',
    creator_channel_url: 'https://www.youtube.com/@mohitdecodes',
    short_description: 'An exhaustive 15+ hour Django masterclass covering MVT architecture, ORM, migrations, views, URLs, templates, admin panel, DRF, caching, and email handling.',
    summary_markdown: `> **Note:** This is a comprehensive 15+ hour masterclass. Skip sections you already know and focus on the DRF and Caching sections for advanced interview prep.

### 📌 Django Architecture Blueprint
1. **MVT Architecture:** Understand Model-View-Template and how it differs from MVC.
2. **Django ORM:** Object-Relational Mapping, querysets (\`all\`, \`filter\`, \`exclude\`), and database migrations.
3. **Django REST Framework (DRF):** Serializers, ViewSets, APIViews, GenericAPIViews, and Routers for API development.
4. **Authentication & Security:** Custom user models, JWT stateless authentication, sessions, and CSRF protection.
5. **Caching & Emails:** Redis/Memcached caching strategies (per-view, template fragment) and Celery email delegation.`,
    practice_items: [
      { id: "dj-1", type: "quiz", title: "What is Django's MVT architecture?", description: "MVT stands for Model-View-Template. The Model handles database logic, the View handles business logic and acts as the controller, and the Template handles the presentation (HTML)." },
      { id: "dj-2", type: "quiz", title: "How does Django's ORM prevent SQL injection?", description: "Django's ORM automatically escapes all parameters used in database queries by separating the query from the parameters, preventing malicious SQL execution." },
      { id: "dj-3", type: "quiz", title: "What is the N+1 query problem and how do you fix it in Django?", description: "It occurs when accessing related objects in a loop, causing N additional DB queries. Fix it using `select_related()` for ForeignKey and `prefetch_related()` for ManyToMany fields." },
      { id: "dj-4", type: "quiz", title: "What is the difference between `null=True` and `blank=True` in a model field?", description: "`null=True` affects the database (stores NULL). `blank=True` affects form validation (allows empty fields). For CharFields, use `blank=True` instead of `null=True`." },
      { id: "dj-5", type: "quiz", title: "Explain the `manage.py makemigrations` and `migrate` commands.", description: "`makemigrations` generates Python scripts representing changes to your models. `migrate` executes those scripts to apply the schema changes to the database." },
      { id: "dj-6", type: "quiz", title: "How do you create a custom User model in Django?", description: "Subclass `AbstractUser` or `AbstractBaseUser` in `models.py` and set `AUTH_USER_MODEL = 'app_name.CustomUser'` in `settings.py` before initial migrations." },
      { id: "dj-7", type: "quiz", title: "What is the purpose of CSRF tokens in Django?", description: "Cross-Site Request Forgery (CSRF) tokens protect against malicious attacks by verifying that POST requests originate from the site's own trusted forms, not external sites." },
      { id: "dj-8", type: "quiz", title: "What is the difference between `APIView` and `ViewSet` in DRF?", description: "`APIView` maps HTTP methods (get, post) to handler functions. `ViewSet` maps actions (list, retrieve, create) to methods, allowing automatic URL routing via Routers." },
      { id: "dj-9", type: "quiz", title: "How do Serializers work in Django REST Framework?", description: "Serializers translate complex Python data types (like querysets) into JSON format, and parse incoming JSON data back into Python objects after validating the input." },
      { id: "dj-10", type: "quiz", title: "Explain stateless authentication using JWT.", description: "JSON Web Tokens contain the user's identity and a signature. The server verifies the signature without checking the database, making it stateless and scalable." },
      { id: "dj-11", type: "quiz", title: "What is the role of Middleware in Django?", description: "Middleware is a series of hooks into Django's request/response processing. It can intercept, modify, or block requests globally (e.g., Authentication, CSRF)." },
      { id: "dj-12", type: "quiz", title: "How do you optimize a Django QuerySet that fetches a large dataset?", description: "Use `.iterator()` to prevent loading the entire queryset into memory, or use `.values()` / `.values_list()` to only fetch the specific columns needed." },
      { id: "dj-13", type: "quiz", title: "What does `transaction.atomic()` do?", description: "It wraps a block of code in a database transaction. If an exception occurs within the block, all database changes are rolled back automatically to maintain integrity." },
      { id: "dj-14", type: "quiz", title: "Explain the difference between `get()` and `filter()`.", description: "`get()` returns a single object and raises an exception if 0 or multiple objects match. `filter()` returns a QuerySet containing all matching objects (can be empty)." },
      { id: "dj-15", type: "quiz", title: "How does Django handle sessions?", description: "Django stores session data in the database (by default) and sends a session ID cookie to the client. The client sends the cookie back to identify themselves." },
      { id: "dj-16", type: "quiz", title: "What is the `related_name` attribute used for in ForeignKey fields?", description: "It specifies the name of the reverse relation from the related model back to the defining model, allowing backwards querying without using the default `modelname_set`." },
      { id: "dj-17", type: "quiz", title: "How do you implement pagination in DRF?", description: "Configure `DEFAULT_PAGINATION_CLASS` and `PAGE_SIZE` in `settings.py`, or override `pagination_class` in a specific View/ViewSet to return chunked data." },
      { id: "dj-18", type: "quiz", title: "What are Django Signals?", description: "A dispatcher allowing decoupled apps to get notified when actions occur elsewhere (e.g., `post_save`, `pre_delete`). Useful for side effects like sending welcome emails." },
      { id: "dj-19", type: "quiz", title: "How do you serve static files in production vs development?", description: "In development, Django serves them automatically via `runserver`. In production, you run `collectstatic` to gather them into `STATIC_ROOT` and serve them via Nginx/CDN." },
      { id: "dj-20", type: "quiz", title: "Explain Cache-Aside strategy in Django.", description: "Before querying the database, the app checks the cache (e.g., Redis). If data exists (hit), it's returned. If not (miss), it queries the DB, stores it in cache, and returns it." },
      { id: "dj-21", type: "quiz", title: "What is the difference between `@staticmethod` and `@classmethod` in Python?", description: "`@classmethod` takes `cls` as the first argument and can access class state. `@staticmethod` takes no implicit argument and behaves like a regular function inside a class namespace." },
      { id: "dj-22", type: "quiz", title: "How do you handle background tasks in a Django application?", description: "Use Celery with a message broker like Redis or RabbitMQ to offload long-running tasks (e.g., email sending, data processing) from the main request/response cycle." },
      { id: "dj-23", type: "quiz", title: "What is a slug in Django and why use it?", description: "A slug is a URL-friendly string (e.g., 'my-first-post') typically derived from a title. It improves SEO and makes URLs more readable than using integer IDs." },
      { id: "dj-24", type: "quiz", title: "Explain the purpose of `F()` expressions.", description: "`F()` allows referencing model field values directly in the database without pulling them into Python memory, avoiding race conditions during updates (e.g., `views = F('views') + 1`)." },
      { id: "dj-25", type: "quiz", title: "What is the `__str__` method in a Django model?", description: "It defines the human-readable string representation of an object, which is used in the Django admin panel and shell output." },
      { id: "dj-26", type: "quiz", title: "How do you override the save() method in a model?", description: "Define `def save(self, *args, **kwargs):` in your model, add custom logic (e.g., generating a slug), and then call `super().save(*args, **kwargs)`." },
      { id: "dj-27", type: "quiz", title: "What is the `unique_together` Meta option?", description: "It enforces a unique constraint across multiple fields at the database level, ensuring that no two rows have the exact same combination of values for those fields." },
      { id: "dj-28", type: "quiz", title: "Explain token-based authentication vs JWT.", description: "Standard token auth stores tokens in the database. JWT is stateless; the token itself contains the user payload and signature, requiring no database lookup for verification." },
      { id: "dj-29", type: "quiz", title: "What is Cross-Origin Resource Sharing (CORS) and how is it handled?", description: "CORS is a browser security feature. Use `django-cors-headers` middleware and configure `CORS_ALLOWED_ORIGINS` to permit frontend applications (e.g., React) to access the API." },
      { id: "dj-30", type: "quiz", title: "How do you implement generic views in Django?", description: "Use classes like `ListView`, `DetailView`, or `CreateView` from `django.views.generic`. They abstract common patterns and drastically reduce boilerplate code." },
      { id: "dj-31", type: "quiz", title: "What is the difference between `ModelForm` and `Form`?", description: "`ModelForm` automatically generates fields and validation based on an existing Django model, while `Form` requires manual definition of every field and validation rule." },
      { id: "dj-32", type: "quiz", title: "How do you handle file uploads in Django?", description: "Ensure the HTML form has `enctype=\"multipart/form-data\"`. In views, handle `request.FILES`. Models should use `FileField` or `ImageField` with `upload_to` specified." },
      { id: "dj-33", type: "quiz", title: "Explain the `Q` object in Django queries.", description: "`Q` objects are used to construct complex database queries involving logical OR (`|`) and NOT (`~`) operators, which cannot be done with standard `filter()` arguments." },
      { id: "dj-34", type: "quiz", title: "What is database indexing and how do you apply it in Django?", description: "Indexing speeds up read operations but slows down writes. Apply it using `db_index=True` on a field or defining `indexes` in the model's `Meta` class." },
      { id: "dj-35", type: "quiz", title: "How do you perform aggregation in Django?", description: "Use the `aggregate()` function to calculate values over an entire QuerySet (e.g., `Sum('price')`), or `annotate()` to calculate values per object in the QuerySet." },
      { id: "dj-36", type: "quiz", title: "What is the role of `settings.py`?", description: "It acts as the central configuration file for a Django project, containing database settings, installed apps, middleware, static file configurations, and security keys." },
      { id: "dj-37", type: "quiz", title: "Explain per-view caching.", description: "Using the `@cache_page` decorator, Django caches the HTML output of a specific view for a defined duration, bypassing the entire view execution for subsequent requests." },
      { id: "dj-38", type: "quiz", title: "How do you run custom management commands in Django?", description: "Create a `management/commands` directory within an app, add a Python file with a `Command` class inheriting from `BaseCommand`, and define the `handle()` method." },
      { id: "dj-39", type: "quiz", title: "What is Django's `get_object_or_404` shortcut?", description: "It tries to fetch an object from the database using `get()`. If the object does not exist, it raises an `Http404` exception instead of a 500 server error." },
      { id: "dj-40", type: "quiz", title: "How does routing work in Django REST Framework?", description: "DRF provides `SimpleRouter` and `DefaultRouter` which automatically generate URL confs for ViewSets, handling routing for list, create, retrieve, update, and destroy actions." },
      { id: "dj-41", type: "quiz", title: "What is the purpose of `WSGI` and `ASGI`?", description: "WSGI handles synchronous Python web applications. ASGI is the modern standard for asynchronous Python web applications, enabling WebSockets and long-polling." },
      { id: "dj-42", type: "quiz", title: "How do you validate data in a DRF Serializer?", description: "Define custom validation methods like `validate_<fieldname>(self, value)` for single fields, or `validate(self, data)` for object-level cross-field validation." },
      { id: "dj-43", type: "quiz", title: "Explain the difference between `ModelSerializer` and `Serializer`.", description: "`ModelSerializer` automatically generates a set of fields and default `create()`/`update()` methods based on a model. `Serializer` requires manual implementation of everything." },
      { id: "dj-44", type: "quiz", title: "What are permissions in DRF?", description: "Permissions determine if a request should be granted access. Common classes include `IsAuthenticated`, `IsAdminUser`, and `AllowAny`. Custom permissions can check object-level access." },
      { id: "dj-45", type: "quiz", title: "How do you serialize nested relationships in DRF?", description: "Use nested serializers (e.g., `author = AuthorSerializer()`) or relational fields like `StringRelatedField` or `PrimaryKeyRelatedField` within the main serializer." },
      { id: "dj-46", type: "quiz", title: "What is Throttling in DRF?", description: "Throttling limits the rate at which clients can make requests to the API (e.g., 100 requests/hour) to prevent abuse, scraping, or Denial of Service attacks." },
      { id: "dj-47", type: "quiz", title: "How do you test Django applications?", description: "Use Django's `TestCase` class. It creates a separate test database, runs tests, and destroys it afterward. DRF provides `APITestCase` for testing API endpoints." },
      { id: "dj-48", type: "quiz", title: "What are Context Processors in Django?", description: "Functions that inject variables globally into the context of every template across the application (e.g., user auth status, global settings), preventing repetitive view code." },
      { id: "dj-49", type: "quiz", title: "Explain the use of `select_for_update()`.", description: "It locks the selected database rows until the end of the transaction, preventing race conditions when multiple concurrent requests attempt to modify the same data." },
      { id: "dj-50", type: "quiz", title: "How do you handle environment variables securely in Django?", description: "Use tools like `python-dotenv` or `django-environ` to load sensitive data (SECRET_KEY, DB credentials) from a `.env` file, which is excluded from version control." }
    ]
  },
  {
    slug: 'django-react-ecommerce-full-stack',
    title: 'Django + React Full Stack E-Commerce Build',
    module_name: 'Production Deployments & Integrations',
    topic_order: 2,
    duration_minutes: 197, // 3h 17m
    video_url: 'https://youtu.be/eeZDJCPTFx4',
    video_title: 'Django + React E-Commerce Full Stack Project | 3 Hours | Real World Project',
    creator_name: 'Mohit Decodes',
    creator_channel_url: 'https://www.youtube.com/@mohitdecodes',
    short_description: 'Build a production-ready e-commerce platform integrating Django REST Framework (DRF) backend, PostgreSQL, and a React frontend styled with TailwindCSS.',
    summary_markdown: `> **Note:** This practical build consolidates API design, React integration, and database architecture.

### 📌 Architecture Breakdown
1. **Infrastructure:** PostgreSQL database, DRF backend, and React (Vite) frontend.
2. **CORS:** Enabling Cross-Origin Resource Sharing for backend-frontend communication.
3. **Authentication:** JWT access and refresh token management stored securely.
4. **State Management:** React Context API for global cart state and user session handling.
5. **Checkout Flow:** Creating orders, handling quantities, and clearing cart data.`,
    practice_items: [
      { id: "ec-1", type: "quiz", title: "Why is PostgreSQL preferred over SQLite for production E-Commerce apps?", description: "PostgreSQL handles high concurrency, supports complex analytical queries, enforces strict data integrity, and does not suffer from SQLite's database-level locking during writes." },
      { id: "ec-2", type: "quiz", title: "How do you prevent a 'Race Condition' during checkout inventory deduction?", description: "Use Django's `transaction.atomic()` combined with `select_for_update()` to lock the inventory row, ensuring concurrent checkout requests are processed sequentially." },
      { id: "ec-3", type: "quiz", title: "Why store JWT access tokens in memory and refresh tokens in HttpOnly cookies?", description: "HttpOnly cookies mitigate Cross-Site Scripting (XSS) attacks because JavaScript cannot access them. In-memory access tokens protect against CSRF attacks." },
      { id: "ec-4", type: "quiz", title: "What is CORS and why must it be configured in a Django + React setup?", description: "Cross-Origin Resource Sharing prevents browsers from making requests to a different domain/port. You must use `django-cors-headers` to whitelist the React app's URL." },
      { id: "ec-5", type: "quiz", title: "How do you optimize React Cart State management?", description: "Use React Context API or Redux. Prevent unnecessary re-renders by using `useMemo` for derived data (like cart totals) and keeping the state shape normalized." },
      { id: "ec-6", type: "quiz", title: "Explain payment idempotency.", description: "Idempotency ensures that making the same payment request multiple times (e.g., due to network drops) only charges the customer once, usually via unique Idempotency Keys." },
      { id: "ec-7", type: "quiz", title: "Why use TailwindCSS over traditional CSS frameworks in modern React apps?", description: "Tailwind provides utility-first classes, enabling rapid styling without context switching to CSS files, and its build process purges unused CSS for extremely small bundle sizes." },
      { id: "ec-8", type: "quiz", title: "How do you handle API request authorization in React?", description: "Create an Axios interceptor or a custom `authFetch` wrapper that automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests." },
      { id: "ec-9", type: "quiz", title: "What is the purpose of `Vite` in modern React development?", description: "Vite is a fast build tool and dev server that leverages native ES modules, providing instant hot module replacement (HMR) and significantly faster startup times than Webpack." },
      { id: "ec-10", type: "quiz", title: "How do you model an E-Commerce Cart in the database?", description: "Typically requires two models: a `Cart` (linked to a User/Session) and `CartItem` (ForeignKeys to Cart and Product, plus Quantity). This handles many-to-many relationships." },
      { id: "ec-11", type: "quiz", title: "Why process image uploads asynchronously?", description: "Image resizing and CDN uploading can take seconds, blocking the HTTP response. Offloading to Celery ensures the API responds immediately while processing happens in the background." },
      { id: "ec-12", type: "quiz", title: "How do you handle soft deletes for products?", description: "Instead of hard deleting a product (which breaks old order history), add an `is_active` boolean field. Filter active products for the store, but keep inactive ones for historical records." },
      { id: "ec-13", type: "quiz", title: "Explain how to protect against Cart Abandonment.", description: "Store cart data persistently in the database (or Redis) tied to the user session, rather than relying solely on local storage, allowing follow-up email campaigns." },
      { id: "ec-14", type: "quiz", title: "What is the `useEffect` cleanup function used for?", description: "It prevents memory leaks by canceling active fetch requests, clearing timeouts/intervals, or unsubscribing from event listeners when a React component unmounts." },
      { id: "ec-15", type: "quiz", title: "How do you implement search functionality efficiently?", description: "For simple searches, use Django's `icontains` filter. For production, integrate full-text search engines like PostgreSQL's `SearchVector` or external services like Elasticsearch/Algolia." },
      { id: "ec-16", type: "quiz", title: "Why use UUIDs for Order numbers instead of auto-incrementing integers?", description: "Integer IDs expose your business metrics (competitors can guess order volume). UUIDs are unpredictable and non-sequential, providing better security and privacy." },
      { id: "ec-17", type: "quiz", title: "How do you manage environment-specific variables in React (Vite)?", description: "Define variables in a `.env` file prefixed with `VITE_` (e.g., `VITE_API_BASE_URL`). Access them in code using `import.meta.env.VITE_API_BASE_URL`." },
      { id: "ec-18", type: "quiz", title: "What is the role of a DRF `ModelViewSet` in this project?", description: "It drastically reduces boilerplate by automatically providing complete CRUD actions (list, create, retrieve, update, destroy) mapped to standard HTTP methods for a model." },
      { id: "ec-19", type: "quiz", title: "How do you handle JWT Token Expiration in the React frontend?", description: "Implement an Axios interceptor that catches 401 Unauthorized errors. It should pause the original request, call the refresh token endpoint, update the access token, and retry the request." },
      { id: "ec-20", type: "quiz", title: "Why is database normalization important for an Order schema?", description: "It reduces data redundancy. Storing historical snapshot data (like price at the time of purchase) in an `OrderItem` table prevents past orders from changing if the current product price changes." }
    ]
  }
];

async function seedDjangoMasterclasses() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Schema guard: Ensure optional/new columns exist so queries don't fail
    await client.query(`
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 0;
      ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_url TEXT;
      ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_title TEXT;
      ALTER TABLE topics ALTER COLUMN name DROP NOT NULL;
    `);

    const resCheck = await client.query(`
      SELECT 1 FROM information_schema.tables WHERE table_name = 'resources';
    `);
    if (resCheck.rows.length > 0) {
      await client.query(`
        ALTER TABLE resources ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255);
        ALTER TABLE resources ADD COLUMN IF NOT EXISTS creator_channel_url TEXT;
      `);
    }

    // 1. Locate the Track
    const trackRes = await client.query(`SELECT id FROM tracks WHERE slug = 'python-backend-development';`);
    if (trackRes.rows.length === 0) {
      throw new Error("Track 'python-backend-development' not found! Make sure you ran the previous roadmap script.");
    }
    const trackId = trackRes.rows[0].id;
    console.log(`Found 'Development' track (ID: ${trackId})`);

    let cumulativeMinutes = 0;

    // 2. Clear old mappings to prevent duplication
    await client.query(`DELETE FROM track_topics WHERE track_id = $1;`, [trackId]);

    // 3. Insert / Update Topics
    for (const [index, data] of LECTURES.entries()) {
      let topicId;
      const cleanVideoUrl = cleanUrl(data.video_url);
      const cleanChannelUrl = cleanUrl(data.creator_channel_url);

      const checkTopic = await client.query(`SELECT id FROM topics WHERE slug = $1;`, [data.slug]);
      
      const videoLinks = JSON.stringify([
        {
          title: data.video_title,
          url: cleanVideoUrl,
          duration_minutes: data.duration_minutes,
          creator_name: data.creator_name,
          creator_channel_url: cleanChannelUrl
        }
      ]);

      const insertParams = [
        data.title,              // $1 name
        data.title,              // $2 title
        data.slug,               // $3 slug
        data.topic_order,        // $4 topic_order
        data.module_name,        // $5 module_name
        data.duration_minutes,   // $6 duration_minutes
        data.duration_minutes,   // $7 estimated_minutes
        cleanVideoUrl,           // $8 video_url
        data.video_title,        // $9 video_title
        data.short_description,  // $10 short_description
        data.short_description,  // $11 description
        data.summary_markdown,   // $12 summary_markdown
        data.summary_markdown,   // $13 theory_summary
        JSON.stringify(data.practice_items), // $14 practice_items
        videoLinks,              // $15 video_links
        data.creator_name,       // $16 creator_name
        cleanChannelUrl          // $17 creator_channel_url
      ];

      // Insert or Update Topic
      if (checkTopic.rows.length === 0) {
        const ins = await client.query(`
          INSERT INTO topics (
            name, title, slug, topic_order, module_name, 
            duration_minutes, estimated_minutes, video_url, video_title, 
            short_description, description, summary_markdown, theory_summary, 
            practice_items, video_links, creator_name, creator_channel_url
          )
          VALUES (
            $1, $2, $3, $4, $5, 
            $6, $7, $8, $9, 
            $10, $11, $12, $13, 
            $14::jsonb, $15::jsonb, $16, $17
          )
          RETURNING id;
        `, insertParams);
        topicId = ins.rows[0].id;
      } else {
        topicId = checkTopic.rows[0].id;
        await client.query(`
          UPDATE topics SET 
            name = $1,
            title = $2,
            topic_order = $4,
            module_name = $5,
            duration_minutes = $6,
            estimated_minutes = $7,
            video_url = $8,
            video_title = $9,
            short_description = $10,
            description = $11,
            summary_markdown = $12,
            theory_summary = $13,
            practice_items = $14::jsonb,
            video_links = $15::jsonb,
            creator_name = $16,
            creator_channel_url = $17
          WHERE id = $18;
        `, [...insertParams, topicId]);
      }
      console.log(`Saved Topic [${topicId}]: ${data.title}`);

      // Map to Track
      await client.query(`INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES ($1, $2, $3);`, [trackId, topicId, index + 1]);
      cumulativeMinutes += data.duration_minutes;

      // Handle Resources Table Sync (if exists)
      if (resCheck.rows.length > 0) {
        const existRes = await client.query(`SELECT id FROM resources WHERE topic_id = $1 AND resource_type = 'video';`, [topicId]);
        if (existRes.rows.length === 0) {
          await client.query(`
            INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes, creator_name, creator_channel_url)
            VALUES ($1, $2, $3, 'video', $4, $5, $6);
          `, [topicId, data.video_title, cleanVideoUrl, data.duration_minutes, data.creator_name, cleanChannelUrl]);
        } else {
          await client.query(`
            UPDATE resources SET title=$1, url=$2, estimated_minutes=$3, creator_name=$4, creator_channel_url=$5 WHERE topic_id = $6 AND resource_type = 'video';
          `, [data.video_title, cleanVideoUrl, data.duration_minutes, data.creator_name, cleanChannelUrl, topicId]);
        }
      }
    }

    // 4. Update Track Metadata
    const hours = Math.ceil(cumulativeMinutes / 60);
    await client.query(`
      UPDATE tracks SET total_topics = 2, duration_hours = $1 WHERE id = $2;
    `, [hours, trackId]);

    // 5. Update Python Backend Developer Path total_topics if path exists
    const pathCheck = await client.query(`
      SELECT id FROM preparation_paths 
      WHERE slug = 'python-backend-developer' OR name = 'Python Backend Developer' OR id = 6;
    `);
    if (pathCheck.rows.length > 0) {
      const pId = pathCheck.rows[0].id;
      // Count total topics linked across all tracks in path
      const countRes = await client.query(`
        SELECT COUNT(DISTINCT tt.topic_id)::int AS count
        FROM path_tracks pt
        JOIN track_topics tt ON pt.track_id = tt.track_id
        WHERE pt.path_id = $1;
      `, [pId]);
      const totalTopicsCount = countRes.rows[0].count;
      await client.query(`
        UPDATE preparation_paths SET total_topics = $1 WHERE id = $2;
      `, [totalTopicsCount, pId]);
      console.log(`Updated Path [${pId}] total_topics to ${totalTopicsCount}.`);
    }

    await client.query('COMMIT');
    console.log(`\nSuccessfully seeded Django Development track! Inserted 70 detailed QA placement items and updated hours to ~${hours}h.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Migration Error:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDjangoMasterclasses();
