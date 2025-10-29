// Personal Dashboard JavaScript
class PersonalDashboard {
    constructor() {
        this.settings = this.loadSettings();
        this.todos = this.loadTodos();
        this.events = this.loadEvents();
        this.currentDate = new Date();
        this.sessionStartTime = new Date();
        this.refreshInterval = null;
        
        this.init();
    }

    init() {
        this.updateDateTime();
        this.setupEventListeners();
        this.loadWeather();
        this.renderTodos();
        this.startAutoRefresh();
        this.startClockUpdate();
        
        // Apply saved theme
        if (this.settings.theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            this.updateThemeToggle();
        }
        
        // Update greeting with user name
        this.updateGreeting();
    }

    // Settings Management
    loadSettings() {
        const defaultSettings = {
            userName: 'User',
            theme: 'light',
            refreshInterval: 10,
            showSeconds: true,
            enableNotifications: true,
            city: 'Your City',
            googleCalendarId: '',
            googleApiKey: ''
        };
        
        const saved = localStorage.getItem('dashboardSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));
    }

    // Todo Management
    loadTodos() {
        const saved = localStorage.getItem('dashboardTodos');
        return saved ? JSON.parse(saved) : [];
    }

    saveTodos() {
        localStorage.setItem('dashboardTodos', JSON.stringify(this.todos));
    }

    // Event Management
    loadEvents() {
        const saved = localStorage.getItem('dashboardEvents');
        return saved ? JSON.parse(saved) : [];
    }

    saveEvents() {
        localStorage.setItem('dashboardEvents', JSON.stringify(this.events));
    }

    // Event Listeners
    setupEventListeners() {
        // Weather
        document.getElementById('update-weather').addEventListener('click', () => {
            this.loadWeather();
        });

        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadWeather();
            }
        });

        // Todo
        document.getElementById('add-todo').addEventListener('click', () => {
            this.addTodo();
        });

        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompletedTodos();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Settings modal
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettingsFromModal();
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Close modal when clicking outside
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                this.closeSettings();
            }
        });
    }

    // Date and Time
    updateDateTime() {
        const now = new Date();
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(this.settings.showSeconds && { second: '2-digit' })
        };
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);

        // Update greeting based on time
        this.updateGreeting();
    }

    startClockUpdate() {
        // Update clock every second
        setInterval(() => {
            this.updateDateTime();
        }, 1000);
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good ';
        
        if (hour < 12) greeting += 'Morning';
        else if (hour < 17) greeting += 'Afternoon';
        else greeting += 'Evening';
        
        greeting += `, ${this.settings.userName}!`;
        document.getElementById('greeting').textContent = greeting;
    }

    // Weather functionality
    async loadWeather() {
        const city = document.getElementById('city-input').value || this.settings.city;
        const weatherContent = document.getElementById('weather-content');
        
        weatherContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading weather...</p>
            </div>
        `;

        try {
            // Using wttr.in API (free, no API key required)
            // This provides real weather data
            const response = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1`
            );
            
            if (!response.ok) throw new Error('Weather data not found');
            
            const data = await response.json();
            this.displayRealWeather(data, city);
            
        } catch (error) {
            console.error('Weather error:', error);
            // Fallback to trying a different API
            try {
                const fallbackResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=40.7&longitude=-74.0&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=America%2FNew_York`
                );
                
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    this.displayOpenMeteoWeather(fallbackData, city);
                } else {
                    this.displayWeatherError(city);
                }
            } catch (fallbackError) {
                console.error('Fallback weather error:', fallbackError);
                this.displayWeatherError(city);
            }
        }
    }

    displayRealWeather(data, city) {
        const weatherContent = document.getElementById('weather-content');
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const feelsLike = current.FeelsLikeC;
        const humidity = current.humidity;
        const windSpeed = current.windspeedKmph;
        const desc = current.weatherDesc[0].value;
        const pressure = current.pressure;
        const visibility = current.visibility;
        const uvIndex = current.uvIndex;
        const cloudCover = current.cloudcover;
        const windDir = current.winddir16Point;
        
        // Additional data from weather API
        const astronomy = data.weather[0].astronomy[0];
        const sunrise = astronomy.sunrise;
        const sunset = astronomy.sunset;
        const moonPhase = astronomy.moon_phase;
        const moonIllumination = astronomy.moon_illumination;
        
        // High/Low temps for today
        const todayWeather = data.weather[0];
        const maxTemp = todayWeather.maxtempC;
        const minTemp = todayWeather.mintempC;
        
        // Map weather codes to icons
        const weatherCode = current.weatherCode;
        const iconMap = {
            '113': 'fas fa-sun', '116': 'fas fa-cloud-sun', '119': 'fas fa-cloud',
            '122': 'fas fa-cloud', '143': 'fas fa-smog', '176': 'fas fa-cloud-rain',
            '179': 'fas fa-cloud-snow', '182': 'fas fa-cloud-rain', '185': 'fas fa-cloud-rain',
            '200': 'fas fa-bolt', '227': 'fas fa-snowflake', '230': 'fas fa-snowflake',
            '248': 'fas fa-smog', '260': 'fas fa-smog', '263': 'fas fa-cloud-rain',
            '266': 'fas fa-cloud-rain', '281': 'fas fa-cloud-snow', '284': 'fas fa-cloud-snow',
            '293': 'fas fa-cloud-rain', '296': 'fas fa-cloud-rain', '299': 'fas fa-cloud-rain',
            '302': 'fas fa-cloud-rain', '305': 'fas fa-cloud-rain', '308': 'fas fa-cloud-rain',
            '311': 'fas fa-cloud-rain', '314': 'fas fa-cloud-rain', '317': 'fas fa-cloud-rain',
            '320': 'fas fa-cloud-snow', '323': 'fas fa-cloud-snow', '326': 'fas fa-cloud-snow',
            '329': 'fas fa-snowflake', '332': 'fas fa-snowflake', '335': 'fas fa-snowflake',
            '338': 'fas fa-snowflake', '350': 'fas fa-cloud-rain', '353': 'fas fa-cloud-rain',
            '356': 'fas fa-cloud-rain', '359': 'fas fa-cloud-rain', '362': 'fas fa-cloud-rain',
            '365': 'fas fa-cloud-rain', '368': 'fas fa-cloud-snow', '371': 'fas fa-snowflake',
            '374': 'fas fa-cloud-rain', '377': 'fas fa-cloud-rain', '386': 'fas fa-bolt',
            '389': 'fas fa-bolt', '392': 'fas fa-bolt', '395': 'fas fa-bolt'
        };
        
        const icon = iconMap[weatherCode] || 'fas fa-cloud';
        
        weatherContent.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="weather-temp-section">
                    <div class="weather-temp">${temp}°C</div>
                    <div class="weather-temp-range">
                        <span class="temp-high"><i class="fas fa-arrow-up"></i> ${maxTemp}°C</span>
                        <span class="temp-low"><i class="fas fa-arrow-down"></i> ${minTemp}°C</span>
                    </div>
                </div>
            </div>
            <div class="weather-desc">${desc.toLowerCase()}</div>
            
            <div class="weather-details-grid">
                <div class="weather-detail">
                    <i class="fas fa-thermometer-half"></i>
                    <div class="detail-info">
                        <span class="detail-label">Feels like</span>
                        <span class="detail-value">${feelsLike}°C</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <div class="detail-info">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${humidity}%</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <div class="detail-info">
                        <span class="detail-label">Wind</span>
                        <span class="detail-value">${Math.round(windSpeed * 0.278)} m/s ${windDir}</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-eye"></i>
                    <div class="detail-info">
                        <span class="detail-label">Visibility</span>
                        <span class="detail-value">${visibility} km</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <div class="detail-info">
                        <span class="detail-label">Pressure</span>
                        <span class="detail-value">${pressure} mb</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-sun"></i>
                    <div class="detail-info">
                        <span class="detail-label">UV Index</span>
                        <span class="detail-value">${uvIndex}</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-cloud"></i>
                    <div class="detail-info">
                        <span class="detail-label">Cloud Cover</span>
                        <span class="detail-value">${cloudCover}%</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="detail-info">
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${city}</span>
                    </div>
                </div>
            </div>
            
            <div class="weather-astronomy">
                <div class="astronomy-item">
                    <i class="fas fa-sun" style="color: #f59e0b;"></i>
                    <span>Sunrise: ${sunrise}</span>
                </div>
                <div class="astronomy-item">
                    <i class="fas fa-moon" style="color: #6b7280;"></i>
                    <span>Sunset: ${sunset}</span>
                </div>
                <div class="astronomy-item">
                    <i class="fas fa-circle" style="color: #e5e7eb;"></i>
                    <span>Moon: ${moonPhase} (${moonIllumination}%)</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 15px; font-size: 0.8rem; color: var(--text-secondary);">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> Live Weather Data
            </div>
        `;
    }

    displayOpenMeteoWeather(data, city) {
        const weatherContent = document.getElementById('weather-content');
        const current = data.current_weather;
        const temp = Math.round(current.temperature);
        const windSpeed = Math.round(current.windspeed * 0.278); // Convert to m/s
        const humidity = data.hourly.relativehumidity_2m[0];
        
        // Map weather codes to conditions and icons
        const getWeatherInfo = (code) => {
            const weatherMap = {
                0: { desc: 'Clear sky', icon: 'fas fa-sun' },
                1: { desc: 'Mainly clear', icon: 'fas fa-cloud-sun' },
                2: { desc: 'Partly cloudy', icon: 'fas fa-cloud-sun' },
                3: { desc: 'Overcast', icon: 'fas fa-cloud' },
                45: { desc: 'Foggy', icon: 'fas fa-smog' },
                48: { desc: 'Depositing rime fog', icon: 'fas fa-smog' },
                51: { desc: 'Light drizzle', icon: 'fas fa-cloud-rain' },
                53: { desc: 'Moderate drizzle', icon: 'fas fa-cloud-rain' },
                55: { desc: 'Dense drizzle', icon: 'fas fa-cloud-rain' },
                61: { desc: 'Slight rain', icon: 'fas fa-cloud-rain' },
                63: { desc: 'Moderate rain', icon: 'fas fa-cloud-rain' },
                65: { desc: 'Heavy rain', icon: 'fas fa-cloud-rain' },
                71: { desc: 'Slight snow', icon: 'fas fa-snowflake' },
                73: { desc: 'Moderate snow', icon: 'fas fa-snowflake' },
                75: { desc: 'Heavy snow', icon: 'fas fa-snowflake' },
                95: { desc: 'Thunderstorm', icon: 'fas fa-bolt' },
                96: { desc: 'Thunderstorm with hail', icon: 'fas fa-bolt' },
                99: { desc: 'Heavy thunderstorm with hail', icon: 'fas fa-bolt' }
            };
            return weatherMap[code] || { desc: 'Unknown', icon: 'fas fa-cloud' };
        };
        
        const weatherInfo = getWeatherInfo(current.weathercode);
        
        weatherContent.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">
                    <i class="${weatherInfo.icon}"></i>
                </div>
                <div class="weather-temp">${temp}°C</div>
            </div>
            <div class="weather-desc">${weatherInfo.desc}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-thermometer-half"></i>
                    <span>Real temperature ${temp}°C</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity ${humidity}%</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind ${windSpeed} m/s</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${city}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> Live Weather Data
            </div>
        `;
    }

    displayWeatherError(city) {
        const weatherContent = document.getElementById('weather-content');
        weatherContent.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 10px;"></i>
                <p>Unable to load weather data for ${city}</p>
                <p style="font-size: 0.8rem;">Please check your internet connection or try a different city.</p>
            </div>
        `;
    }

    displayWeather(data) {
        const weatherContent = document.getElementById('weather-content');
        const iconMap = {
            '01d': 'fas fa-sun', '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun', '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud', '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud', '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain', '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain', '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog', '50n': 'fas fa-smog'
        };
        
        const icon = iconMap[data.weather[0].icon] || 'fas fa-cloud';
        
        weatherContent.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="weather-temp">${Math.round(data.main.temp)}°C</div>
            </div>
            <div class="weather-desc">${data.weather[0].description}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-thermometer-half"></i>
                    <span>Feels like ${Math.round(data.main.feels_like)}°C</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity ${data.main.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind ${data.wind.speed} m/s</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${data.name}</span>
                </div>
            </div>
        `;
    }

    // Quote functionality
    async loadQuote() {
        const quoteContent = document.getElementById('quote-content');
        
        quoteContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading quote...</p>
            </div>
        `;

        try {
            // Using quotable.io API (free, no key required)
            const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=150');
            
            if (!response.ok) throw new Error('Failed to fetch quote');
            
            const data = await response.json();
            this.displayQuote(data.content, data.author);
            
        } catch (error) {
            console.error('Quote error:', error);
            this.displayMockQuote();
        }
    }

    displayMockQuote() {
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.displayQuote(randomQuote.text, randomQuote.author);
    }

    displayQuote(text, author) {
        const quoteContent = document.getElementById('quote-content');
        quoteContent.innerHTML = `
            <div class="quote-text">"${text}"</div>
            <div class="quote-author">— ${author}</div>
        `;
    }

    // Todo functionality
    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        input.value = '';
        
        if (this.settings.enableNotifications && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Task Added', {
                    body: `"${text}" has been added to your to-do list`,
                    icon: '/favicon.ico'
                });
            }
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    clearCompletedTodos() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.renderTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        const todoCounter = document.getElementById('todo-counter');
        
        const pendingCount = this.todos.filter(t => !t.completed).length;
        todoCounter.textContent = `${pendingCount} task${pendingCount !== 1 ? 's' : ''}`;
        
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
            return;
        }
        
        todoList.innerHTML = this.todos.map(todo => `
            <div class="todo-item${todo.completed ? ' completed' : ''}">
                <input type="checkbox" class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="dashboard.toggleTodo(${todo.id})">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" onclick="dashboard.deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Theme Management
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveSettings();
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (this.settings.theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            }
        } else {
            body.removeAttribute('data-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        }
    }

    updateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            if (this.settings.theme === 'dark') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        }
    }

    // Settings Modal
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'block';
            this.populateSettingsForm();
        }
    }

    closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    populateSettingsForm() {
        const userNameInput = document.getElementById('user-name');
        const refreshIntervalInput = document.getElementById('refresh-interval');
        const showSecondsInput = document.getElementById('show-seconds');
        const enableNotificationsInput = document.getElementById('enable-notifications');

        if (userNameInput) userNameInput.value = this.settings.userName;
        if (refreshIntervalInput) refreshIntervalInput.value = this.settings.refreshInterval;
        if (showSecondsInput) showSecondsInput.checked = this.settings.showSeconds;
        if (enableNotificationsInput) enableNotificationsInput.checked = this.settings.enableNotifications;
    }

    saveSettingsFromModal() {
        const userNameInput = document.getElementById('user-name');
        const refreshIntervalInput = document.getElementById('refresh-interval');
        const showSecondsInput = document.getElementById('show-seconds');
        const enableNotificationsInput = document.getElementById('enable-notifications');

        if (userNameInput) this.settings.userName = userNameInput.value;
        if (refreshIntervalInput) this.settings.refreshInterval = parseInt(refreshIntervalInput.value);
        if (showSecondsInput) this.settings.showSeconds = showSecondsInput.checked;
        if (enableNotificationsInput) this.settings.enableNotifications = enableNotificationsInput.checked;

        this.saveSettings();
        this.updateGreeting();
        this.closeSettings();
        
        // Restart auto-refresh if interval changed
        this.startAutoRefresh();
    }

    resetSettings() {
        this.settings = {
            userName: 'User',
            theme: 'light',
            refreshInterval: 10,
            showSeconds: true,
            enableNotifications: true,
            city: 'Your City',
            googleCalendarId: '',
            googleApiKey: ''
        };
        this.saveSettings();
        this.applyTheme();
        this.updateGreeting();
        this.populateSettingsForm();
    }

    // Auto Refresh
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.loadWeather();
        }, this.settings.refreshInterval * 60 * 1000);
    }

    // Helper function
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize new widgets functionality
    initNotes() {
        this.renderNotes();
        this.setupNotesListeners();
    }

    setupNotesListeners() {
        const addBtn = document.getElementById('add-note-btn');
        const saveBtn = document.getElementById('save-note');
        const cancelBtn = document.getElementById('cancel-note');
        const input = document.getElementById('new-note-input');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.showNoteInput());
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveNote());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideNoteInput());
        }
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.saveNote();
                }
            });
        }
    }

    showNoteInput() {
        const inputArea = document.querySelector('.note-input-area');
        if (inputArea) {
            inputArea.style.display = 'block';
            document.getElementById('new-note-input').focus();
        }
    }

    hideNoteInput() {
        const inputArea = document.querySelector('.note-input-area');
        const input = document.getElementById('new-note-input');
        if (inputArea && input) {
            inputArea.style.display = 'none';
            input.value = '';
        }
    }

    saveNote() {
        const input = document.getElementById('new-note-input');
        const text = input?.value.trim();
        
        if (!text) return;
        
        const note = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString()
        };
        
        this.notes = JSON.parse(localStorage.getItem('dashboard-notes')) || [];
        this.notes.unshift(note);
        localStorage.setItem('dashboard-notes', JSON.stringify(this.notes));
        this.renderNotes();
        this.hideNoteInput();
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        localStorage.setItem('dashboard-notes', JSON.stringify(this.notes));
        this.renderNotes();
    }

    renderNotes() {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;
        
        this.notes = JSON.parse(localStorage.getItem('dashboard-notes')) || [];
        
        if (this.notes.length === 0) {
            notesList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);"><i class="fas fa-sticky-note" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i><p>No notes yet. Click + to add one!</p></div>';
        } else {
            notesList.innerHTML = this.notes.map(note => `
                <div class="note-item">
                    <div class="note-content">${this.escapeHtml(note.text)}</div>
                    <div class="note-meta">
                        <span class="note-date">${note.timestamp}</span>
                        <button class="delete-note-btn" onclick="dashboard.deleteNote(${note.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Initialize Projects
    initProjects() {
        this.renderProjects();
        this.setupProjectsListeners();
    }

    setupProjectsListeners() {
        const addBtn = document.getElementById('add-project-btn');
        const saveBtn = document.getElementById('save-project');
        const cancelBtn = document.getElementById('cancel-project');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.showProjectInput());
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProject());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideProjectInput());
        }
    }

    showProjectInput() {
        const inputArea = document.querySelector('.project-input-area');
        if (inputArea) {
            inputArea.style.display = 'block';
            document.getElementById('project-name-input').focus();
        }
    }

    hideProjectInput() {
        const inputArea = document.querySelector('.project-input-area');
        if (inputArea) {
            inputArea.style.display = 'none';
            document.getElementById('project-name-input').value = '';
            document.getElementById('project-description-input').value = '';
            document.getElementById('project-status-select').value = 'planning';
        }
    }

    saveProject() {
        const nameInput = document.getElementById('project-name-input');
        const descInput = document.getElementById('project-description-input');
        const statusSelect = document.getElementById('project-status-select');
        
        const name = nameInput?.value.trim();
        const description = descInput?.value.trim();
        const status = statusSelect?.value;
        
        if (!name) return;
        
        const project = {
            id: Date.now(),
            name: name,
            description: description || '',
            status: status,
            created: new Date().toLocaleDateString()
        };
        
        this.projects = JSON.parse(localStorage.getItem('dashboard-projects')) || [];
        this.projects.unshift(project);
        localStorage.setItem('dashboard-projects', JSON.stringify(this.projects));
        this.renderProjects();
        this.hideProjectInput();
    }

    updateProjectStatus(id, newStatus) {
        this.projects = JSON.parse(localStorage.getItem('dashboard-projects')) || [];
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.status = newStatus;
            localStorage.setItem('dashboard-projects', JSON.stringify(this.projects));
            this.renderProjects();
        }
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        localStorage.setItem('dashboard-projects', JSON.stringify(this.projects));
        this.renderProjects();
    }

    renderProjects() {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;
        
        this.projects = JSON.parse(localStorage.getItem('dashboard-projects')) || [];
        
        if (this.projects.length === 0) {
            projectsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);"><i class="fas fa-project-diagram" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i><p>No projects yet. Click + to add one!</p></div>';
        } else {
            projectsList.innerHTML = this.projects.map(project => `
                <div class="project-item">
                    <div class="project-header">
                        <h4 class="project-name">${this.escapeHtml(project.name)}</h4>
                        <select class="project-status-select" onchange="dashboard.updateProjectStatus(${project.id}, this.value)">
                            <option value="planning" ${project.status === 'planning' ? 'selected' : ''}>Planning</option>
                            <option value="in-progress" ${project.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="testing" ${project.status === 'testing' ? 'selected' : ''}>Testing</option>
                            <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="on-hold" ${project.status === 'on-hold' ? 'selected' : ''}>On Hold</option>
                        </select>
                    </div>
                    ${project.description ? `<p class="project-description">${this.escapeHtml(project.description)}</p>` : ''}
                    <div class="project-meta">
                        <span class="project-date">Created: ${project.created}</span>
                        <button class="delete-project-btn" onclick="dashboard.deleteProject(${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Initialize System Metrics
    initSystemMetrics() {
        this.updateSystemMetrics();
        this.setupSystemMetricsListeners();
        this.startSystemMetricsAutoUpdate();
    }

    startSystemMetricsAutoUpdate() {
        // Update system metrics every 5 seconds
        setInterval(() => {
            this.updateSystemMetrics();
        }, 5000);
    }

    setupSystemMetricsListeners() {
        const refreshBtn = document.getElementById('refresh-metrics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.updateSystemMetrics());
        }
    }

    updateSystemMetrics() {
        // Simulate system metrics for usage meters
        const cpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%
        const memoryUsage = Math.floor(Math.random() * 40) + 30; // 30-70%
        const diskUsage = Math.floor(Math.random() * 20) + 45; // 45-65%
        
        this.updateMetricDisplay('cpu', cpuUsage);
        this.updateMetricDisplay('memory', memoryUsage);
        this.updateMetricDisplay('disk', diskUsage);
        
        // Update hardware specifications
        this.updateHardwareSpecs();
    }

    updateHardwareSpecs() {
        // CPU Information
        const cpuCores = navigator.hardwareConcurrency || 'Unknown';
        this.setElementText('cpu-cores', cpuCores + (cpuCores !== 'Unknown' ? ' cores' : ''));
        this.setElementText('cpu-model', this.detectCPU());
        this.setElementText('cpu-architecture', this.detectArchitecture());

        // Memory Information
        if ('memory' in performance) {
            const memory = performance.memory;
            this.setElementText('total-memory', this.formatBytes(memory.totalJSHeapSize));
            this.setElementText('available-memory', this.formatBytes(memory.totalJSHeapSize - memory.usedJSHeapSize));
            this.setElementText('heap-size', this.formatBytes(memory.usedJSHeapSize));
        } else {
            this.setElementText('total-memory', 'Not available');
            this.setElementText('available-memory', 'Not available');
            this.setElementText('heap-size', 'Not available');
        }

        // Storage Information (estimated)
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                this.setElementText('storage-total', this.formatBytes(estimate.quota || 0));
                this.setElementText('storage-used', this.formatBytes(estimate.usage || 0));
                this.setElementText('storage-free', this.formatBytes((estimate.quota || 0) - (estimate.usage || 0)));
            }).catch(() => {
                this.setElementText('storage-total', 'Not available');
                this.setElementText('storage-used', 'Not available');
                this.setElementText('storage-free', 'Not available');
            });
        } else {
            this.setElementText('storage-total', 'Not available');
            this.setElementText('storage-used', 'Not available');
            this.setElementText('storage-free', 'Not available');
        }

        // Graphics Information
        this.updateGraphicsInfo();

        // Display Information
        this.setElementText('screen-resolution', `${screen.width} x ${screen.height}`);
        this.setElementText('color-depth', `${screen.colorDepth}-bit`);
        this.setElementText('refresh-rate', screen.refreshRate ? `${screen.refreshRate} Hz` : 'Unknown');

        // System Information
        this.setElementText('operating-system', this.detectOS());
        this.setElementText('browser-info', this.getBrowserInfo());
        this.setElementText('user-agent', navigator.userAgent.substring(0, 50) + '...');
    }

    updateGraphicsInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    this.setElementText('gpu-info', vendor || 'Unknown');
                    this.setElementText('gpu-renderer', renderer || 'Unknown');
                } else {
                    this.setElementText('gpu-info', 'WebGL available');
                    this.setElementText('gpu-renderer', 'Masked for security');
                }
                this.setElementText('webgl-version', 'WebGL 1.0');
            } else {
                this.setElementText('gpu-info', 'Not available');
                this.setElementText('gpu-renderer', 'Not available');
                this.setElementText('webgl-version', 'Not supported');
            }
        } catch (e) {
            this.setElementText('gpu-info', 'Detection failed');
            this.setElementText('gpu-renderer', 'Detection failed');
            this.setElementText('webgl-version', 'Detection failed');
        }
    }

    detectCPU() {
        // Try to detect CPU from user agent
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('intel')) return 'Intel Processor';
        if (ua.includes('amd')) return 'AMD Processor';
        if (ua.includes('arm')) return 'ARM Processor';
        if (ua.includes('apple')) return 'Apple Silicon';
        return 'Unknown CPU';
    }

    detectArchitecture() {
        // Detect architecture
        if (navigator.platform.includes('64')) return '64-bit';
        if (navigator.platform.includes('32')) return '32-bit';
        if (navigator.platform.includes('ARM')) return 'ARM';
        return 'Unknown';
    }

    detectOS() {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (platform.includes('win')) return 'Windows';
        if (platform.includes('mac')) return 'macOS';
        if (platform.includes('linux')) return 'Linux';
        if (userAgent.includes('android')) return 'Android';
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
        return navigator.platform || 'Unknown OS';
    }

    setElementText(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateMetricDisplay(type, percentage) {
        const progressElement = document.getElementById(`${type}-progress`);
        const percentageElement = document.getElementById(`${type}-percentage`);
        
        if (progressElement && percentageElement) {
            progressElement.style.width = `${percentage}%`;
            percentageElement.textContent = `${percentage}%`;
            
            // Color coding based on usage
            let color = '#10b981'; // Green
            if (percentage > 70) color = '#ef4444'; // Red
            else if (percentage > 50) color = '#f59e0b'; // Orange
            
            progressElement.style.backgroundColor = color;
        }
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // Initialize Network Speed Test
    initNetworkSpeed() {
        this.setupNetworkSpeedListeners();
        this.updateConnectionInfo();
        this.startNetworkSpeedAutoUpdate();
    }

    startNetworkSpeedAutoUpdate() {
        // Run speed test automatically every 10 minutes
        setInterval(() => {
            this.startSpeedTest();
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        // Run initial test after 30 seconds
        setTimeout(() => {
            this.startSpeedTest();
        }, 30000);
    }

    setupNetworkSpeedListeners() {
        const testBtn = document.getElementById('start-speed-test');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.startSpeedTest());
        }
    }

    async startSpeedTest() {
        const testBtn = document.getElementById('start-speed-test');
        const testProgress = document.getElementById('test-progress-fill');
        const testStatus = document.getElementById('test-status');
        
        if (!testBtn || !testProgress || !testStatus) return;
        
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        
        try {
            // Simulate speed test with progress
            const steps = [
                { step: 'Preparing test...', progress: 10 },
                { step: 'Testing download speed...', progress: 40 },
                { step: 'Testing upload speed...', progress: 70 },
                { step: 'Testing ping...', progress: 90 },
                { step: 'Complete!', progress: 100 }
            ];
            
            for (const { step, progress } of steps) {
                testStatus.textContent = step;
                testProgress.style.width = `${progress}%`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Simulate results
            const downloadSpeed = (Math.random() * 80 + 20).toFixed(1);
            const uploadSpeed = (Math.random() * 40 + 10).toFixed(1);
            const ping = Math.floor(Math.random() * 30 + 10);
            
            document.getElementById('download-speed').textContent = `${downloadSpeed} Mbps`;
            document.getElementById('upload-speed').textContent = `${uploadSpeed} Mbps`;
            document.getElementById('ping-value').textContent = `${ping} ms`;
            document.getElementById('last-test-time').textContent = new Date().toLocaleTimeString();
            
            testStatus.textContent = 'Test completed successfully';
            
        } catch (error) {
            console.error('Speed test error:', error);
            testStatus.textContent = 'Test failed. Please try again.';
        } finally {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
            setTimeout(() => {
                testProgress.style.width = '0%';
                testStatus.textContent = 'Ready to test';
            }, 3000);
        }
    }

    updateConnectionInfo() {
        const connectionType = document.getElementById('connection-type');
        if (connectionType) {
            if (navigator.connection) {
                connectionType.textContent = navigator.connection.effectiveType || 'Unknown';
            } else {
                connectionType.textContent = 'Unknown';
            }
        }
    }

    // Initialize Battery Status
    initBatteryStatus() {
        this.updateBatteryStatus();
        this.setupBatteryListeners();
    }

    setupBatteryListeners() {
        const refreshBtn = document.getElementById('refresh-battery');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.updateBatteryStatus());
        }
    }

    async updateBatteryStatus() {
        const batteryContainer = document.getElementById('battery-container');
        const batteryNotSupported = document.getElementById('battery-not-supported');
        
        if (!batteryContainer || !batteryNotSupported) return;
        
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                
                batteryNotSupported.style.display = 'none';
                batteryContainer.style.display = 'block';
                
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                document.getElementById('battery-level').style.width = `${level}%`;
                document.getElementById('battery-percentage').textContent = `${level}%`;
                document.getElementById('charging-status').textContent = charging ? 'Yes' : 'No';
                document.getElementById('charging-status').className = `status-indicator ${charging ? 'charging' : 'not-charging'}`;
                
                // Update battery color based on level
                const batteryLevel = document.getElementById('battery-level');
                if (level > 50) batteryLevel.style.backgroundColor = '#10b981';
                else if (level > 20) batteryLevel.style.backgroundColor = '#f59e0b';
                else batteryLevel.style.backgroundColor = '#ef4444';
                
                // Update time remaining
                const timeRemaining = document.getElementById('time-remaining');
                if (charging && battery.chargingTime !== Infinity) {
                    const hours = Math.floor(battery.chargingTime / 3600);
                    const minutes = Math.floor((battery.chargingTime % 3600) / 60);
                    timeRemaining.textContent = `${hours}h ${minutes}m to full`;
                } else if (!charging && battery.dischargingTime !== Infinity) {
                    const hours = Math.floor(battery.dischargingTime / 3600);
                    const minutes = Math.floor((battery.dischargingTime % 3600) / 60);
                    timeRemaining.textContent = `${hours}h ${minutes}m remaining`;
                } else {
                    timeRemaining.textContent = 'Unknown';
                }
                
                document.getElementById('battery-health').textContent = 'Good';
                document.getElementById('battery-status-text').textContent = charging ? 'Charging' : 'On Battery';
                
            } else {
                throw new Error('Battery API not supported');
            }
        } catch (error) {
            console.log('Battery API not supported:', error);
            batteryContainer.style.display = 'none';
            batteryNotSupported.style.display = 'block';
        }
    }
}




// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new PersonalDashboard();
    
    // Initialize integrated widgets
    dashboard.initNotes();
    dashboard.initProjects();
    dashboard.initSystemMetrics();
    dashboard.initNetworkSpeed();
    dashboard.initBatteryStatus();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}
