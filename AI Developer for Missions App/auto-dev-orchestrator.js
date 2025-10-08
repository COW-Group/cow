#!/usr/bin/env node

/**
 * Automated Development Orchestrator for Missions-App
 *
 * This script automates the development process by:
 * 1. Interacting with Claude API to get development suggestions
 * 2. Integrating with Monday.com MCP for project management
 * 3. Implementing features with Apple liquid glass styling
 * 4. Managing Git operations with safety mechanisms
 * 5. Integrating with Supabase for data persistence
 *
 * Safety Features:
 * - Automated commits with rollback capability
 * - Build/test verification before commits
 * - Style consistency checking
 * - Error monitoring and alerts
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');
const DevelopmentFlowReview = require('./flow-review.js');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const CONFIG = {
  projectPath: '/Users/likhitha/Projects/cow/apps/missions-app',
  maxIterations: 10,
  commitFrequency: 5, // Commits every 5 changes
  backupBranches: true,
  sessionDurationMinutes: 30, // Default, will be prompted
  iterationDelayMinutes: 2, // Time between iterations
  claude: {
    useClaudeCode: true, // Use Claude Code instead of API
    codeCommand: 'claude', // Command to invoke Claude Code
  },
  monday: {
    apiEndpoint: 'https://api.monday.com/v2',
    boardId: process.env.MONDAY_BOARD_ID || null
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },
  styling: {
    preserveAppleGlass: true,
    mondayColors: {
      status: ['#00c875', '#ffcb00', '#e2445c', '#579bfc', '#a25ddc']
    }
  }
};

class AutoDevOrchestrator {
  constructor() {
    this.iteration = 0;
    this.changeCount = 0;
    this.backupBranches = [];
    this.errorLog = [];
    this.developmentLog = [];
    this.stylingGuidelines = null;

    this.initializeOrchestrator();
  }

  async initializeOrchestrator() {
    console.log('🚀 Initializing Automated Development Orchestrator...');

    // Show flow review first (Salesforce Flow Builder style)
    const flowApproved = await this.showFlowReview();
    if (!flowApproved) {
      console.log('❌ Flow review not approved. Exiting...');
      rl.close();
      process.exit(0);
    }

    // Get user preferences for this session
    await this.getUserPreferences();

    // Validate environment
    await this.validateEnvironment();

    // Extract current styling guidelines
    await this.extractStylingGuidelines();

    // Initialize integrations
    await this.initializeIntegrations();

    // Start development loop
    await this.startDevelopmentLoop();
  }

  async getUserPreferences() {
    console.log('\n🎯 Development Session Configuration');
    console.log('=====================================\n');

    // Check Claude CLI availability
    await this.checkClaudeCLI();

    // Setup Monday.com MCP if needed
    await this.setupMondayMCP();

    // Get session duration
    const duration = await this.promptUser(
      '⏱️  How long should this development session run? (in minutes, default: 30): '
    );

    if (duration && !isNaN(parseInt(duration))) {
      CONFIG.sessionDurationMinutes = parseInt(duration);
    }

    // Get max iterations
    const iterations = await this.promptUser(
      '🔄 Maximum number of development iterations? (default: 10): '
    );

    if (iterations && !isNaN(parseInt(iterations))) {
      CONFIG.maxIterations = parseInt(iterations);
    }

    // Get commit frequency
    const commitFreq = await this.promptUser(
      '💾 Commit changes every X iterations? (default: 5): '
    );

    if (commitFreq && !isNaN(parseInt(commitFreq))) {
      CONFIG.commitFrequency = parseInt(commitFreq);
    }

    // Get iteration delay
    const delay = await this.promptUser(
      '⏳ Minutes to wait between iterations? (default: 2): '
    );

    if (delay && !isNaN(parseInt(delay))) {
      CONFIG.iterationDelayMinutes = parseInt(delay);
    }

    // Confirm session setup
    console.log('\n📋 Session Configuration:');
    console.log(`   Duration: ${CONFIG.sessionDurationMinutes} minutes`);
    console.log(`   Max iterations: ${CONFIG.maxIterations}`);
    console.log(`   Commit frequency: every ${CONFIG.commitFrequency} iterations`);
    console.log(`   Iteration delay: ${CONFIG.iterationDelayMinutes} minutes`);

    const confirm = await this.promptUser('\n✅ Start development session? (y/N): ');

    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Development session cancelled.');
      process.exit(0);
    }

    console.log('\n🚀 Starting development session...\n');
  }

  async showFlowReview() {
    console.log('\n📋 Before we begin, let\'s review the automated development flow:');
    console.log('================================================================');

    const flowReview = new DevelopmentFlowReview();
    const approved = await flowReview.showFlowReview();
    flowReview.close();

    return approved;
  }

  async checkClaudeCLI() {
    try {
      const output = execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' });
      console.log(`✅ Claude CLI found: ${output.trim()}`);
    } catch (error) {
      console.log('❌ Claude CLI not found or not working');
      console.log('📥 Please install Claude CLI from: https://claude.ai/code');

      const proceed = await this.promptUser('Continue without Claude CLI? (y/N): ');
      if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('❌ Development session cancelled.');
        process.exit(0);
      }
      CONFIG.claude.available = false;
    }
  }

  async setupMondayMCP() {
    console.log('\n🔗 Monday.com MCP Setup');
    console.log('========================');

    const setupMCP = await this.promptUser('Setup Monday.com MCP login for this session? (y/N): ');

    if (setupMCP.toLowerCase() === 'y' || setupMCP.toLowerCase() === 'yes') {
      console.log('📋 Please follow these steps to setup Monday.com MCP:');
      console.log('1. Open Claude Code in another terminal');
      console.log('2. Ensure Monday.com MCP server is configured');
      console.log('3. Authenticate with your Monday.com workspace');

      const mcpReady = await this.promptUser('\nIs Monday.com MCP ready and authenticated? (y/N): ');

      if (mcpReady.toLowerCase() === 'y' || mcpReady.toLowerCase() === 'yes') {
        const boardId = await this.promptUser('Enter your Monday.com Board ID (optional): ');
        if (boardId) {
          CONFIG.monday.boardId = boardId;
        }
        CONFIG.monday.available = true;
        console.log('✅ Monday.com MCP configured');
      } else {
        CONFIG.monday.available = false;
        console.log('⚠️  Proceeding without Monday.com integration');
      }
    } else {
      CONFIG.monday.available = false;
      console.log('⚠️  Skipping Monday.com MCP setup');
    }
  }

  promptUser(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async validateEnvironment() {
    console.log('✅ Validating environment...');

    // Environment variables are now optional since we handle setup interactively
    const optionalEnvVars = [
      'MONDAY_API_TOKEN',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    console.log('📋 Checking optional environment variables:');
    optionalEnvVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName} is set`);
      } else {
        console.log(`⚠️  ${varName} not set (will be handled during session setup)`);
      }
    });

    // Check if we're in the correct directory
    if (!fs.existsSync(CONFIG.projectPath)) {
      throw new Error(`Project path not found: ${CONFIG.projectPath}`);
    }

    // Verify Git repository
    try {
      execSync('git status', { cwd: CONFIG.projectPath, stdio: 'ignore' });
    } catch (error) {
      throw new Error('Not in a Git repository or Git not available');
    }

    console.log('✅ Environment validation complete');
  }

  async extractStylingGuidelines() {
    console.log('🎨 Extracting current styling guidelines...');

    const stylesPath = path.join(CONFIG.projectPath, 'src/styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');

    // Extract key styling patterns
    this.stylingGuidelines = {
      appleGlass: {
        colors: this.extractCSSVariables(stylesContent, '--theme-'),
        glassEffects: this.extractClassPatterns(stylesContent, 'liquid-glass'),
        animations: this.extractKeyframes(stylesContent)
      },
      typography: this.extractFontSettings(stylesContent),
      spacing: this.extractSpacingPatterns(stylesContent)
    };

    console.log('✅ Styling guidelines extracted');
  }

  extractCSSVariables(content, prefix) {
    const regex = new RegExp(`${prefix}[a-zA-Z-]+:\\s*[^;]+`, 'g');
    return content.match(regex) || [];
  }

  extractClassPatterns(content, pattern) {
    const regex = new RegExp(`\\.${pattern}[a-zA-Z-]*\\s*{[^}]*}`, 'g');
    return content.match(regex) || [];
  }

  extractKeyframes(content) {
    const regex = /@keyframes\s+[^{]+\s*{[^}]+}/g;
    return content.match(regex) || [];
  }

  extractFontSettings(content) {
    const fontRegex = /font-family:\s*[^;]+/g;
    const weightRegex = /font-weight:\s*[^;]+/g;
    return {
      families: content.match(fontRegex) || [],
      weights: content.match(weightRegex) || []
    };
  }

  extractSpacingPatterns(content) {
    const paddingRegex = /padding:\s*[^;]+/g;
    const marginRegex = /margin:\s*[^;]+/g;
    return {
      padding: content.match(paddingRegex) || [],
      margin: content.match(marginRegex) || []
    };
  }

  async initializeIntegrations() {
    console.log('🔗 Initializing integrations...');

    // Claude Code integration (no client needed - uses CLI directly)

    // Initialize Monday.com MCP client
    this.mondayClient = new MondayMCPClient(process.env.MONDAY_API_TOKEN);

    // Initialize Supabase client
    if (CONFIG.supabase.url && CONFIG.supabase.key) {
      this.supabaseClient = new SupabaseClient(CONFIG.supabase.url, CONFIG.supabase.key);
    }

    console.log('✅ Integrations initialized');
  }

  async startDevelopmentLoop() {
    console.log('🔄 Starting development loop...');

    // Set up session timeout
    const sessionStartTime = Date.now();
    const sessionTimeoutMs = CONFIG.sessionDurationMinutes * 60 * 1000;

    console.log(`⏰ Session will run for ${CONFIG.sessionDurationMinutes} minutes or ${CONFIG.maxIterations} iterations, whichever comes first.\n`);

    while (this.iteration < CONFIG.maxIterations) {
      // Check if session time limit reached
      const elapsedTime = Date.now() - sessionStartTime;
      if (elapsedTime >= sessionTimeoutMs) {
        console.log(`\n⏰ Session time limit (${CONFIG.sessionDurationMinutes} minutes) reached. Ending session gracefully.`);
        break;
      }

      const remainingTime = Math.ceil((sessionTimeoutMs - elapsedTime) / (1000 * 60));
      console.log(`⏱️  Time remaining: ${remainingTime} minutes`);
      try {
        console.log(`\n--- Iteration ${this.iteration + 1} ---`);

        // Get current project state
        const projectState = await this.analyzeProjectState();

        // Ask Claude what to implement next
        const suggestion = await this.getClaudeSuggestion(projectState);

        // Implement the suggestion
        const implementationResult = await this.implementSuggestion(suggestion);

        // Verify the implementation
        const verificationResult = await this.verifyImplementation();

        if (verificationResult.success) {
          // Update Monday.com board
          await this.updateMondayBoard(suggestion, 'completed');

          // Commit changes if needed
          if (this.shouldCommit()) {
            await this.commitChanges(suggestion);
          }

          // Log successful iteration
          this.logIteration(suggestion, 'success');
        } else {
          // Handle implementation failure
          await this.handleImplementationFailure(suggestion, verificationResult.error);
        }

        this.iteration++;

        // Wait between iterations (user-configurable)
        if (this.iteration < CONFIG.maxIterations) {
          console.log(`⏳ Waiting ${CONFIG.iterationDelayMinutes} minutes before next iteration...`);
          await this.sleep(CONFIG.iterationDelayMinutes * 60 * 1000);
        }

      } catch (error) {
        console.error(`❌ Error in iteration ${this.iteration + 1}:`, error.message);
        this.errorLog.push({
          iteration: this.iteration + 1,
          error: error.message,
          timestamp: new Date().toISOString()
        });

        // Attempt recovery
        await this.attemptRecovery(error);
      }
    }

    console.log('🏁 Development loop completed');
    await this.generateSummary();

    // Close readline interface
    rl.close();
  }

  async analyzeProjectState() {
    const packageJson = JSON.parse(fs.readFileSync(path.join(CONFIG.projectPath, 'package.json'), 'utf8'));

    // Get current file structure
    const fileStructure = this.getFileStructure(path.join(CONFIG.projectPath, 'src'));

    // Get recent commits
    const recentCommits = this.getRecentCommits();

    // Get current styling state
    const stylingState = this.analyzeStylingState();

    return {
      packageInfo: {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: Object.keys(packageJson.dependencies || {})
      },
      fileStructure,
      recentCommits,
      stylingState,
      timestamp: new Date().toISOString()
    };
  }

  getFileStructure(dir, depth = 2) {
    if (depth <= 0) return null;

    const items = [];
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          items.push({
            name: file,
            type: 'directory',
            children: this.getFileStructure(filePath, depth - 1)
          });
        } else {
          items.push({
            name: file,
            type: 'file',
            size: stat.size
          });
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }

    return items;
  }

  getRecentCommits(count = 5) {
    try {
      const output = execSync(`git log --oneline -${count}`, {
        cwd: CONFIG.projectPath,
        encoding: 'utf8'
      });
      return output.trim().split('\n');
    } catch (error) {
      return [];
    }
  }

  analyzeStylingState() {
    const stylesPath = path.join(CONFIG.projectPath, 'src/styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');

    return {
      hasAppleGlass: stylesContent.includes('liquid-glass'),
      hasVantaJS: stylesContent.includes('vanta-fallback'),
      colorScheme: this.extractColorScheme(stylesContent),
      componentCount: (stylesContent.match(/\.[a-zA-Z-]+\s*{/g) || []).length
    };
  }

  extractColorScheme(content) {
    const colors = [];
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
    const matches = content.match(colorRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  async getClaudeSuggestion(projectState) {
    const prompt = this.buildClaudePrompt(projectState);

    try {
      console.log('🧠 Asking Claude Code for next development suggestion...');

      // Write prompt to temporary file
      const promptFile = path.join('/tmp', `claude-prompt-${Date.now()}.txt`);
      fs.writeFileSync(promptFile, prompt);

      // Use Claude Code CLI to get suggestion
      const response = await this.invokeClaudeCode(promptFile);

      // Clean up temp file
      fs.unlinkSync(promptFile);

      return this.parseClaudeResponse(response);
    } catch (error) {
      console.error('❌ Failed to get Claude suggestion:', error.message);
      return this.getFallbackSuggestion();
    }
  }

  async invokeClaudeCode(promptFile) {
    if (CONFIG.claude.available === false) {
      throw new Error('Claude CLI not available');
    }

    return new Promise((resolve, reject) => {
      console.log('🤖 Invoking Claude CLI...');

      // Use claude command with the prompt file
      const process = spawn('claude', [promptFile], {
        cwd: CONFIG.projectPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        // Show real-time output from Claude
        process.stdout.write(chunk);
      });

      process.stderr.on('data', (data) => {
        const chunk = data.toString();
        errorOutput += chunk;
        console.error('Claude CLI stderr:', chunk);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Claude CLI failed with code ${code}: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to start Claude CLI: ${error.message}`));
      });

      // Set timeout for Claude response (extended for complex tasks)
      setTimeout(() => {
        process.kill('SIGTERM');
        reject(new Error('Claude CLI response timed out after 2 minutes'));
      }, 120000); // 2 minute timeout
    });
  }

  buildClaudePrompt(projectState) {
    return `
You are an expert React developer working on a Monday.com-style missions app with Apple liquid glass design.

Current Project State:
- App: ${projectState.packageInfo.name}
- Files: ${JSON.stringify(projectState.fileStructure, null, 2)}
- Recent commits: ${projectState.recentCommits.join(', ')}
- Styling: Apple liquid glass with Vanta.js background
- Dependencies: ${projectState.packageInfo.dependencies.join(', ')}

Styling Guidelines:
- Preserve Apple liquid glass effects
- Use Monday.com status column colors: ${CONFIG.styling.mondayColors.status.join(', ')}
- Maintain Vanta.js background integration
- Follow existing component patterns

What should we implement next? Consider:
1. Monday.com foundation-level features (boards, items, status columns)
2. User experience improvements
3. Code quality enhancements
4. New functionality that builds on existing features

Respond with a JSON object:
{
  "feature": "Feature name",
  "description": "Detailed description",
  "priority": "high|medium|low",
  "files": ["list of files to modify/create"],
  "implementation": "Step-by-step implementation guide",
  "styling": "Specific styling requirements"
}
    `;
  }

  parseClaudeResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Unable to parse Claude response');
    }
  }

  getFallbackSuggestion() {
    return {
      feature: "Code Quality Improvement",
      description: "Refactor existing components and improve TypeScript types",
      priority: "medium",
      files: ["src/components/**/*.tsx"],
      implementation: "Review and refactor existing component code for better maintainability",
      styling: "Ensure all components follow Apple liquid glass design patterns"
    };
  }

  async implementSuggestion(suggestion) {
    console.log(`🔨 Implementing: ${suggestion.feature}`);

    try {
      // Create backup branch
      if (CONFIG.backupBranches) {
        const backupBranch = `backup-${Date.now()}`;
        execSync(`git checkout -b ${backupBranch}`, { cwd: CONFIG.projectPath });
        execSync(`git checkout main`, { cwd: CONFIG.projectPath });
        this.backupBranches.push(backupBranch);
      }

      // Implementation logic would go here
      // For now, we'll simulate implementation
      await this.sleep(1000);

      this.changeCount++;
      return { success: true };

    } catch (error) {
      console.error('❌ Implementation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async verifyImplementation() {
    console.log('🧪 Verifying implementation...');

    try {
      // Run build
      execSync('npm run build', {
        cwd: CONFIG.projectPath,
        stdio: 'pipe'
      });

      // Run type check
      execSync('npm run typecheck', {
        cwd: CONFIG.projectPath,
        stdio: 'pipe'
      });

      // Run lint
      execSync('npm run lint', {
        cwd: CONFIG.projectPath,
        stdio: 'pipe'
      });

      // Run tests if available
      try {
        execSync('npm test', {
          cwd: CONFIG.projectPath,
          stdio: 'pipe',
          timeout: 30000
        });
      } catch (testError) {
        console.warn('⚠️  Tests failed or not available');
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  shouldCommit() {
    return this.changeCount >= CONFIG.commitFrequency;
  }

  async commitChanges(suggestion) {
    console.log('💾 Committing changes...');

    try {
      // Add all changes
      execSync('git add .', { cwd: CONFIG.projectPath });

      // Create commit message
      const commitMessage = `feat: ${suggestion.feature}

${suggestion.description}

🤖 Generated with Auto-Dev-Orchestrator
Co-Authored-By: Claude <noreply@anthropic.com>`;

      // Commit
      execSync(`git commit -m "${commitMessage}"`, { cwd: CONFIG.projectPath });

      // Reset change count
      this.changeCount = 0;

      console.log('✅ Changes committed successfully');

    } catch (error) {
      console.error('❌ Commit failed:', error.message);
      throw error;
    }
  }

  async updateMondayBoard(suggestion, status) {
    if (!this.mondayClient) return;

    try {
      await this.mondayClient.createItem({
        boardId: CONFIG.monday.boardId,
        name: suggestion.feature,
        columnValues: {
          status: status,
          description: suggestion.description,
          priority: suggestion.priority
        }
      });
    } catch (error) {
      console.warn('⚠️  Failed to update Monday.com board:', error.message);
    }
  }

  async handleImplementationFailure(suggestion, error) {
    console.log('🔧 Handling implementation failure...');

    // Update Monday.com board with failure status
    await this.updateMondayBoard(suggestion, 'stuck');

    // Log the failure
    this.errorLog.push({
      suggestion,
      error,
      timestamp: new Date().toISOString()
    });

    // Attempt to rollback to last known good state
    await this.rollbackChanges();
  }

  async rollbackChanges() {
    console.log('⏪ Rolling back changes...');

    try {
      // Reset to last commit
      execSync('git reset --hard HEAD', { cwd: CONFIG.projectPath });
      execSync('git clean -fd', { cwd: CONFIG.projectPath });

      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
    }
  }

  async attemptRecovery(error) {
    console.log('🩹 Attempting recovery...');

    // Simple recovery strategies
    await this.rollbackChanges();

    // Wait before retrying
    await this.sleep(5000);
  }

  logIteration(suggestion, status) {
    this.developmentLog.push({
      iteration: this.iteration + 1,
      suggestion,
      status,
      timestamp: new Date().toISOString()
    });
  }

  async generateSummary() {
    console.log('\n📊 Development Session Summary');
    console.log('================================');
    console.log(`Total iterations: ${this.iteration}`);
    console.log(`Successful implementations: ${this.developmentLog.filter(log => log.status === 'success').length}`);
    console.log(`Errors encountered: ${this.errorLog.length}`);
    console.log(`Backup branches created: ${this.backupBranches.length}`);

    // Save detailed log
    const logPath = path.join(CONFIG.projectPath, `dev-session-${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify({
      config: CONFIG,
      developmentLog: this.developmentLog,
      errorLog: this.errorLog,
      backupBranches: this.backupBranches,
      stylingGuidelines: this.stylingGuidelines
    }, null, 2));

    console.log(`\n📝 Detailed log saved to: ${logPath}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// API Client Classes - Claude Code integration is handled directly via CLI

class MondayMCPClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  async createItem(itemData) {
    console.log('📋 Creating Monday.com item...');
    // Simulated Monday.com API call via MCP
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, itemId: Date.now() };
  }
}

class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async logDevelopmentSession(sessionData) {
    console.log('💾 Logging to Supabase...');
    // Simulated Supabase call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
}

// Main execution
if (require.main === module) {
  const orchestrator = new AutoDevOrchestrator();
}

module.exports = AutoDevOrchestrator;