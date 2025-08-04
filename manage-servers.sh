#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Aztec Meme Tournament Server Manager${NC}"
echo "=================================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $port is in use${NC}"
        lsof -i :$port
    else
        echo -e "${RED}❌ Port $port is not in use${NC}"
    fi
}

# Function to kill processes on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔄 Killing processes on port $port...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Killed processes on port $port${NC}"
}

# Function to start servers
start_servers() {
    echo -e "${YELLOW}🚀 Starting servers...${NC}"
    
    # Start backend
    echo -e "${BLUE}Starting backend server...${NC}"
    cd backend && npm run dev &
    BACKEND_PID=$!
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
    
    # Wait a bit
    sleep 3
    
    # Start frontend
    echo -e "${BLUE}Starting frontend server...${NC}"
    cd ../frontend && npm start &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
    
    echo -e "${GREEN}✅ Both servers started!${NC}"
    echo -e "${BLUE}Backend: http://localhost:5000${NC}"
    echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
}

# Function to stop all servers
stop_servers() {
    echo -e "${YELLOW}🛑 Stopping all servers...${NC}"
    
    # Kill processes on specific ports
    kill_port 3000
    kill_port 5000
    
    # Kill any remaining node processes for our project
    pkill -f "server.js" 2>/dev/null
    pkill -f "react-scripts" 2>/dev/null
    pkill -f "nodemon" 2>/dev/null
    
    echo -e "${GREEN}✅ All servers stopped${NC}"
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Server Status:${NC}"
    echo "=================="
    
    check_port 3000
    check_port 5000
    
    echo ""
    echo -e "${BLUE}📋 Running Node.js processes:${NC}"
    ps aux | grep -E "(server.js|react-scripts|nodemon)" | grep -v grep || echo "No server processes found"
}

# Main script logic
case "$1" in
    "start")
        start_servers
        ;;
    "stop")
        stop_servers
        ;;
    "restart")
        stop_servers
        sleep 2
        start_servers
        ;;
    "status")
        show_status
        ;;
    "kill")
        stop_servers
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 {start|stop|restart|status|kill}${NC}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both backend and frontend servers"
        echo "  stop    - Stop all servers"
        echo "  restart - Restart all servers"
        echo "  status  - Show current server status"
        echo "  kill    - Force kill all server processes"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Start servers"
        echo "  $0 status   # Check status"
        echo "  $0 stop     # Stop servers"
        ;;
esac 