import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/_service/auth.guard';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { AdminLayoutComponent } from './admin-layout.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule),

            },
            {
                path: 'list',
                loadChildren: () => import('../../modules/lists/lists.module').then(m => m.ListsModule),
            },
            {
                path: 'school',
                loadChildren: () => import('../../modules/school/school.module').then(m => m.SchoolModule),
            },
            {
                path: 'endorsments',
                loadChildren: () => import('../../modules/endorsments/endorsments.module').then(m => m.EndorsmentsModule),
            },
            {
                path: 'teachers',
                loadChildren: () => import('../../modules/teacher/teacher.module').then(m => m.TeacherModule),
            },
            {
                path: 'questionnaire',
                loadChildren: () => import('../../modules/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule),
            },
            {
                path: 'students',
                loadChildren: () => import('../../modules/students/students.module').then(m => m.StudentsModule),
            },
            {
                path: 'user-profile',
                loadChildren: () => import('../../modules/user-profile/user-profile.module').then(m => m.UserProfileModule),
            },
            {
                path: 'doked-list',
                loadChildren: () => import('../../modules/doked-list/doked-list.module').then(m => m.DokedListModule),
            },
            {
                path: 'report-list',
                loadChildren: () => import('../../modules/reports/reports.module').then(m => m.ReportsModule),
            },
            {
                path: 'gredes',
                loadChildren: () => import('../../modules/grades/grades.module').then(m => m.GradesModule),
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'error/404',
            },
        ]
    }
];


