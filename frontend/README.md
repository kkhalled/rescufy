<h1 align="center">Rescufy Frontend</h1>

<p align="center">
	Role-based emergency operations dashboard for ambulance dispatch, hospital capacity tracking, and request management.
</p>

<hr />

<h2>Project Idea</h2>

<p>
	Rescufy is designed as an operational control interface for emergency response teams.
	The core idea is to keep dispatch decisions, hospital visibility, and incident handling in one place so teams can react faster.
</p>

<p>
	Instead of switching between disconnected systems, users can manage requests, monitor ambulances,
	review hospital load, and administer platform users from one unified web application.
</p>

<h2>Who Uses This</h2>

<ul>
	<li><strong>Admin</strong>: manages users, hospitals, ambulances, analytics, and global requests.</li>
	<li><strong>Hospital User (HospitalAdmin)</strong>: manages hospital-focused workflows such as local requests and profile data.</li>
</ul>

<h2>Main Capabilities</h2>

<ul>
	<li>Authentication and protected routing by role.</li>
	<li>Hospital operations management with profile and capacity visibility.</li>
	<li>Ambulance management with list, profile, status, and tracking workflows.</li>
	<li>Emergency request listing and request details pages.</li>
	<li>User management with add and edit modal flows.</li>
	<li>Analytics and dashboard views for operational insight.</li>
	<li>Multilingual UI (including Arabic and English) with RTL support.</li>
	<li>Light and dark theme token-based styling.</li>
</ul>

<h2>Operational Flow (High Level)</h2>

<ol>
	<li>Users sign in and are routed to role-appropriate layouts.</li>
	<li>Admins monitor requests, hospitals, and ambulances from the control panels.</li>
	<li>Hospital users focus on hospital-specific request and profile workflows.</li>
	<li>Teams update statuses and details as operations evolve in real time.</li>
</ol>

<h2>Tech Stack</h2>

<table>
	<thead>
		<tr>
			<th>Layer</th>
			<th>Technology</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Framework</td>
			<td>React 19 + TypeScript + Vite</td>
		</tr>
		<tr>
			<td>Routing</td>
			<td>React Router</td>
		</tr>
		<tr>
			<td>State</td>
			<td>Redux Toolkit + local hook state</td>
		</tr>
		<tr>
			<td>Forms &amp; Validation</td>
			<td>react-hook-form, Zod, Formik, Yup</td>
		</tr>
		<tr>
			<td>UI</td>
			<td>Tailwind CSS v4, Radix Select, Font Awesome, Lucide</td>
		</tr>
		<tr>
			<td>Networking</td>
			<td>Axios</td>
		</tr>
		<tr>
			<td>Realtime</td>
			<td>SignalR integration support</td>
		</tr>
		<tr>
			<td>Localization</td>
			<td>i18next + react-i18next</td>
		</tr>
	</tbody>
</table>

<h2>Project Structure (Simplified)</h2>

<pre><code>src/
	app/
		layouts/
		routes/
		provider/
	features/
		auth/
		dashboard/
		requests/
		request-details/
		hospitals_management/
		ambulances_management/
		users/
		analytics/
		settings/
	shared/
	i18n/
	styles/
</code></pre>

<h2>Run Locally</h2>

<ol>
	<li>Install dependencies: <strong>npm install</strong></li>
	<li>Start development server: <strong>npm run dev</strong></li>
	<li>Build for production: <strong>npm run build</strong></li>
	<li>Preview production build: <strong>npm run preview</strong></li>
</ol>

<h2>Available Scripts</h2>

<ul>
	<li><strong>npm run dev</strong>: run Vite dev server.</li>
	<li><strong>npm run build</strong>: run TypeScript build and Vite build.</li>
	<li><strong>npm run lint</strong>: run ESLint checks.</li>
	<li><strong>npm run preview</strong>: preview production build.</li>
</ul>

<h2>API Notes</h2>

<p>
	API endpoints are centralized in the app configuration.
	The current backend base URL is configured in the API config file and all features consume endpoints through that shared config.
</p>

<h2>Design Notes</h2>

<ul>
	<li>Semantic theme tokens are used for consistent component styling.</li>
	<li>The light theme has been tuned to use softer off-white surfaces for better visual comfort.</li>
	<li>Animations are intentionally subtle for operational readability.</li>
</ul>

<h2>Status</h2>

<p>
	This frontend is actively evolving and already includes major operational modules for real-world emergency workflow simulation and management.
</p>
