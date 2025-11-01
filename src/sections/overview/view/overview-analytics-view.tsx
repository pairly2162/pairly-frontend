import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';
import { authService } from 'src/services/auth.service';

import type { DashboardStats } from 'src/services/auth.service';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

// Helper function to group data by IST (Indian Standard Time)
const groupByISTDate = <T extends { createdAt: string }>(
  data: T[],
  getUniqueKey?: (item: T) => string
): Array<{ date: string; userCount: number }> => {
  // Group by IST using toLocaleDateString
  const dailyStats: Map<string, Set<string>> = new Map();

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    // Use toLocaleDateString with IST timezone
    const dateKey = date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Kolkata' // Indian Standard Time (IST)
    }); // Format: "MM/DD/YYYY"
    
    // Convert to YYYY-MM-DD format for consistency
    const [month, day, year] = dateKey.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    if (!dailyStats.has(formattedDate)) {
      dailyStats.set(formattedDate, new Set());
    }
    
    // Use unique key if provided (for messages), otherwise use item index
    const uniqueKey = getUniqueKey ? getUniqueKey(item) : item.createdAt;
    dailyStats.get(formattedDate)!.add(uniqueKey);
  });

  // Convert to array format and sort by date
  return Array.from(dailyStats.entries())
    .map(([date, uniqueKeys]) => ({
      date,
      userCount: uniqueKeys.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export function OverviewAnalyticsView() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [dailyChattingUsers, setDailyChattingUsers] = useState<Array<{ date: string; userCount: number }>>([]);
  const [dailyUserCreations, setDailyUserCreations] = useState<Array<{ date: string; userCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch dashboard stats
        const statsResponse = await authService.getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        } else {
          setError(statsResponse.message);
        }

        // Fetch raw data and group by IST dates on frontend
        const rawChattingUsers = await authService.getDailyChattingUsers(30);
        const groupedChattingUsers = groupByISTDate(rawChattingUsers, (item) => item.authorId);
        setDailyChattingUsers(groupedChattingUsers);

        // Fetch raw user creations and group by IST dates on frontend
        const rawUserCreations = await authService.getDailyUserCreations(30);
        const groupedUserCreations = groupByISTDate(rawUserCreations);
        setDailyUserCreations(groupedUserCreations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title="Total Users"
              percent={12.5}
              total={dashboardStats?.totalUsers || 0}
              icon={<img alt="Total Users" src="/assets/icons/glass/ic-glass-users.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title="Online Users"
              percent={dashboardStats ? Math.round((dashboardStats.onlineUsers / dashboardStats.totalUsers) * 100 * 100) / 100 : 0}
              total={dashboardStats?.onlineUsers || 0}
              color="secondary"
              icon={<img alt="Online Users" src="/assets/icons/glass/ic-glass-users.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 47, 40, 62, 73, 30, 23, 54],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title="Offline Users"
              percent={dashboardStats ? Math.round((dashboardStats.offlineUsers / dashboardStats.totalUsers) * 100 * 100) / 100 : 0}
              total={dashboardStats?.offlineUsers || 0}
              color="warning"
              icon={<img alt="Offline Users" src="/assets/icons/glass/ic-glass-users.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [40, 70, 50, 28, 70, 75, 7, 64],
              }}
            />
          </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Daily Chatting Users"
            subheader={`Last 30 days - ${dailyChattingUsers.length > 0 ? `Total ${dailyChattingUsers.reduce((sum, item) => sum + item.userCount, 0)} unique chatting users` : 'No data available'}`}
            chart={{
              categories: dailyChattingUsers.length > 0 
                ? dailyChattingUsers.map(item => {
                    // Format date in IST
                    const date = new Date(item.date + 'T00:00:00');
                    return date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    });
                  })
                : [],
              series: [
                { 
                  name: 'Unique Users', 
                  data: dailyChattingUsers.map(item => item.userCount)
                },
              ],
              options: {
                tooltip: {
                  y: {
                    formatter: (value: number) => `${value} unique user${value !== 1 ? 's' : ''}`
                  }
                }
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Daily User Creations"
            subheader={`Last 30 days - ${dailyUserCreations.length > 0 ? `Total ${dailyUserCreations.reduce((sum, item) => sum + item.userCount, 0)} new users created` : 'No data available'}`}
            chart={{
              colors: ['#FF9800'], // Orange color to differentiate from chatting users chart
              categories: dailyUserCreations.length > 0 
                ? dailyUserCreations.map(item => {
                    // Format date in IST
                    const date = new Date(item.date + 'T00:00:00');
                    return date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    });
                  })
                : [],
              series: [
                { 
                  name: 'Users Created', 
                  data: dailyUserCreations.map(item => item.userCount)
                },
              ],
              options: {
                tooltip: {
                  y: {
                    formatter: (value: number) => `${value} user${value !== 1 ? 's' : ''} created`
                  }
                },
              },
            }}
          />
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_traffic} />
        </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <AnalyticsTasks title="Tasks" list={_tasks} />
          </Grid> */}
        </Grid>
      )}
    </DashboardContent>
  );
}
