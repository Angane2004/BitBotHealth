# SwasthyaSense API Documentation

Complete API reference for SwasthyaSense healthcare analytics platform.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

All API endpoints use Clerk authentication. Include the session token in requests:

```javascript
const response = await fetch('/api/healthcare/insights', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify(data)
});
```

---

## Healthcare Insights API

### Generate Healthcare Insights

**Endpoint:** `POST /api/healthcare/insights`

Generate AI-powered healthcare insights and recommendations based on hospital data, environmental factors, and prediction patterns.

#### Request Body

```typescript
{
  hospitalData?: {
    totalBeds: number;
    occupancyRate: number;              // 0-100
    occupiedBeds?: number;
    trend?: 'increasing' | 'decreasing' | 'stable';
  };
  aqiData?: {
    value: number;                       // 0-500
    category?: string;                   // 'Good', 'Moderate', 'Poor', etc.
    location?: string;
  };
  predictionData?: {
    predictions: Array<{
      date: string;
      predicted: number;
      actual?: number;
      department?: string;
    }>;
  };
  timeframe?: string;                    // '7days', '14days', '21days'
}
```

#### Response

```typescript
{
  success: boolean;
  insights: HealthcareInsight[];
  timestamp: string;
}

interface HealthcareInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  confidence: number;                    // 0-1
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'capacity' | 'staffing' | 'equipment' | 'environmental' | 'outbreak';
  timestamp: Date;
  data?: any;                            // Additional context-specific data
}
```

#### Example Request

```javascript
const response = await fetch('/api/healthcare/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hospitalData: {
      totalBeds: 500,
      occupancyRate: 85,
      trend: 'increasing'
    },
    aqiData: {
      value: 180,
      category: 'Poor'
    },
    predictionData: {
      predictions: [
        { date: '2025-12-29', predicted: 120 },
        { date: '2025-12-30', predicted: 135 },
        { date: '2025-12-31', predicted: 150 }
      ]
    },
    timeframe: '7days'
  })
});

const data = await response.json();
```

#### Example Response

```json
{
  "success": true,
  "insights": [
    {
      "id": "aqi-1735380000000",
      "type": "alert",
      "title": "Critical Air Quality Alert",
      "description": "AQI level of 180 (Poor). Anticipate 25-30% increase in respiratory cases...",
      "confidence": 0.85,
      "priority": "high",
      "category": "environmental",
      "timestamp": "2025-12-28T10:30:00.000Z",
      "data": {
        "aqi": 180,
        "expectedIncrease": "25-30%"
      }
    },
    {
      "id": "capacity-1735380000001",
      "type": "recommendation",
      "title": "Approaching Capacity Limits",
      "description": "Current occupancy at 85%. Prepare for potential capacity constraints...",
      "confidence": 0.87,
      "priority": "high",
      "category": "capacity",
      "timestamp": "2025-12-28T10:30:00.000Z",
      "data": {
        "occupancyRate": 85,
        "totalBeds": 500
      }
    },
    {
      "id": "surge-1735380000002",
      "type": "alert",
      "title": "Patient Surge Pattern Detected",
      "description": "Predictive models indicate 25% increase above average baseline...",
      "confidence": 0.88,
      "priority": "high",
      "category": "outbreak",
      "timestamp": "2025-12-28T10:30:00.000Z",
      "data": {
        "percentChange": 25,
        "avgBaseline": 120,
        "projected": 150
      }
    }
  ],
  "timestamp": "2025-12-28T10:30:00.000Z"
}
```

#### Insight Types

| Type | Description | Use Case |
|------|-------------|----------|
| `prediction` | Future projections | Forecasting trends |
| `recommendation` | Actionable suggestions | Resource planning |
| `alert` | Critical notifications | Immediate action required |
| `trend` | Pattern analysis | Long-term planning |

#### Priority Levels

| Priority | Description | Action Required |
|----------|-------------|-----------------|
| `critical` | Immediate action needed | Within 1 hour |
| `high` | Urgent attention | Within 4 hours |
| `medium` | Moderate concern | Within 24 hours |
| `low` | Informational | Monitor |

---

## Staffing Recommendations API

### Get Staffing Recommendations

**Endpoint:** `POST /api/healthcare/staffing`

Generate AI-powered staffing recommendations based on predicted patient load.

#### Request Body

```typescript
{
  predictedLoad: number;                 // Expected number of patients
  currentStaff: number;                  // Current number of staff members
}
```

#### Response

```typescript
{
  success: boolean;
  recommendation: HealthcareInsight;
  timestamp: string;
}
```

#### Example Request

```javascript
const response = await fetch('/api/healthcare/staffing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    predictedLoad: 120,
    currentStaff: 15
  })
});

const data = await response.json();
```

#### Example Response

```json
{
  "success": true,
  "recommendation": {
    "id": "staffing-1735380000000",
    "type": "recommendation",
    "title": "Additional Staffing Needed",
    "description": "Based on predicted patient load of 120, recommend 20 staff members (current: 15). Shortage of 5 staff...",
    "confidence": 0.85,
    "priority": "high",
    "category": "staffing",
    "timestamp": "2025-12-28T10:30:00.000Z",
    "data": {
      "predictedLoad": 120,
      "currentStaff": 15,
      "recommendedStaff": 20,
      "staffingGap": 5
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```typescript
{
  success: false;
  error: string;                         // Error message
  message?: string;                      // Additional context
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 500 | Internal Server Error | Server-side error |

### Example Error Response

```json
{
  "success": false,
  "error": "Invalid input parameters",
  "message": "predictedLoad must be a positive number"
}
```

---

## Rate Limiting

### Development
- No rate limiting

### Production
- **Rate Limit:** 100 requests per minute per user
- **Burst Limit:** 20 requests per second
- **Headers:** 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Data Models

### HealthcareInsight Model

```typescript
interface HealthcareInsight {
  id: string;                            // Unique identifier
  type: InsightType;
  title: string;                         // Concise title
  description: string;                   // Detailed description
  confidence: number;                    // 0-1 confidence score
  priority: PriorityLevel;
  category: InsightCategory;
  timestamp: Date;
  data?: any;                            // Additional context
}

type InsightType = 'prediction' | 'recommendation' | 'alert' | 'trend';
type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
type InsightCategory = 'capacity' | 'staffing' | 'equipment' | 'environmental' | 'outbreak';
```

---

## Integration Examples

### React Component Example

```typescript
import { useState, useEffect } from 'react';

function HealthcareInsights({ hospitalData, aqiData }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/healthcare/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hospitalData,
            aqiData,
            timeframe: '7days'
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setInsights(data.insights);
        }
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [hospitalData, aqiData]);

  return (
    <div>
      {loading ? <Loading /> : <InsightsList insights={insights} />}
    </div>
  );
}
```

### Node.js/Express Example

```javascript
const fetch = require('node-fetch');

async function getHealthcareInsights(hospitalData, aqiData) {
  try {
    const response = await fetch('https://your-domain.com/api/healthcare/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      },
      body: JSON.stringify({
        hospitalData,
        aqiData,
        timeframe: '7days'
      })
    });

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const response = await fetch('/api/healthcare/insights', {...});
  const data = await response.json();
  
  if (!data.success) {
    console.error('API Error:', data.error);
    return;
  }
  
  // Process data
} catch (error) {
  console.error('Network Error:', error);
}
```

### 2. Use TypeScript for Type Safety

```typescript
import type { HealthcareInsight } from '@/lib/services/healthcare-analytics';

const processInsights = (insights: HealthcareInsight[]) => {
  insights.forEach(insight => {
    if (insight.priority === 'critical') {
      // Handle critical insights
    }
  });
};
```

### 3. Cache Results When Appropriate

```javascript
const cache = new Map();

async function getCachedInsights(key, fetchFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFn();
  cache.set(key, data);
  setTimeout(() => cache.delete(key), 5 * 60 * 1000); // 5 min cache
  
  return data;
}
```

---

## Support

For API support and questions:
- **Documentation:** [docs.swasthyasense.com/api](https://docs.swasthyasense.com/api)
- **Email:** api-support@swasthyasense.com
- **GitHub Issues:** Report bugs and request features

---

<p align="center">
  <strong>SwasthyaSense API Documentation</strong><br>
  Version 1.0.0 | Last Updated: December 2025
</p>
