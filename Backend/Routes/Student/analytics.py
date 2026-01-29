from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from config.db import Sessionlocal
from Schema.application import Applications
from Schema.interview import Interview
from Schema.jobs import Jobs
from Schema.student import Users
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import base64

router = APIRouter(
    prefix="/student",
    tags=["analytics"]
)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

def create_pie_chart_base64(labels: list, sizes: list, title: str, colors: list = None) -> str:
    """Create a pie chart and return as base64 encoded string"""
    plt.figure(figsize=(8, 8))
    if colors is None:
        colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors[:len(labels)])
    plt.title(title, fontsize=16, fontweight='bold', pad=20)
    plt.axis('equal')
    
    # Convert to base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    
    return image_base64

def create_bar_chart_base64(labels: list, values: list, title: str, xlabel: str, ylabel: str, color: str = '#36A2EB') -> str:
    """Create a bar chart and return as base64 encoded string"""
    plt.figure(figsize=(10, 6))
    plt.bar(labels, values, color=color, alpha=0.7, edgecolor='black', linewidth=1.2)
    plt.title(title, fontsize=16, fontweight='bold', pad=20)
    plt.xlabel(xlabel, fontsize=12, fontweight='bold')
    plt.ylabel(ylabel, fontsize=12, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels on bars
    for i, v in enumerate(values):
        plt.text(i, v + max(values) * 0.01, str(v), ha='center', va='bottom', fontweight='bold')
    
    # Convert to base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    
    return image_base64

@router.get("/analytics/{student_uid}")
async def get_student_analytics(student_uid: str, db: Session = Depends(get_db)):
    """
    Get comprehensive analytics for a student including:
    - Application status breakdown (pending, accepted, rejected)
    - Interview scheduled count
    - Students hired count (accepted applications)
    - Job opening field ratio
    """
    try:
        # Verify student exists
        student = db.query(Users).filter(Users.uid == student_uid).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get all applications for this student
        applications = db.query(Applications).filter(Applications.stud_uid == student_uid).all()
        
        # Count applications by status
        status_counts = {
            'pending': 0,
            'accepted': 0,
            'rejected': 0
        }
        
        for app in applications:
            if app.status in status_counts:
                status_counts[app.status] += 1
        
        total_applications = len(applications)
        
        # Count interviews scheduled for this student
        interviews_scheduled = db.query(Interview).filter(
            and_(
                Interview.student_uid == student_uid,
                Interview.status == 'scheduled'
            )
        ).count()
        
        # Count students hired (accepted applications)
        students_hired = status_counts['accepted']
        
        # Count students rejected
        students_rejected = status_counts['rejected']
        
        # Get job opening field ratio (by job type)
        # Get all jobs that this student has applied to
        applied_job_roles = [app.Job_role for app in applications]
        
        # Get all jobs from database to calculate field ratio
        all_jobs = db.query(Jobs).filter(Jobs.status == 'Active').all()
        
        # Count jobs by type
        job_type_counts = {}
        for job in all_jobs:
            job_type = job.type if job.type else 'Other'
            job_type_counts[job_type] = job_type_counts.get(job_type, 0) + 1
        
        # Calculate field ratio (normalize to percentages)
        total_jobs = sum(job_type_counts.values())
        job_field_ratio = {
            field: round((count / total_jobs * 100), 2) if total_jobs > 0 else 0
            for field, count in job_type_counts.items()
        }
        
        # Create pie chart for application status
        status_labels = ['Pending', 'Accepted', 'Rejected']
        status_values = [status_counts['pending'], status_counts['accepted'], status_counts['rejected']]
        status_colors = ['#FFCE56', '#4BC0C0', '#FF6384']
        
        # Filter out zero values for pie chart (but keep at least one if all are zero)
        status_data = [(label, value, color) for label, value, color in zip(status_labels, status_values, status_colors) if value > 0]
        if status_data:
            status_pie_chart = create_pie_chart_base64(
                [d[0] for d in status_data],
                [d[1] for d in status_data],
                'Application Status Distribution',
                [d[2] for d in status_data]
            )
        elif total_applications == 0:
            # If no applications, create a chart showing "No Applications"
            status_pie_chart = create_pie_chart_base64(
                ['No Applications'],
                [1],
                'Application Status Distribution',
                ['#CCCCCC']
            )
        else:
            status_pie_chart = None
        
        # Create bar chart for application status
        status_bar_chart = create_bar_chart_base64(
            status_labels,
            status_values,
            'Application Status Overview',
            'Status',
            'Number of Applications',
            '#36A2EB'
        )
        
        # Create pie chart for job field ratio
        if job_field_ratio and len(job_field_ratio) > 0:
            field_labels = list(job_field_ratio.keys())
            field_values = list(job_field_ratio.values())
            field_colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF']
            
            field_pie_chart = create_pie_chart_base64(
                field_labels,
                field_values,
                'Job Opening Field Ratio',
                field_colors[:len(field_labels)]
            )
        else:
            # If no jobs, create a chart showing "No Jobs Available"
            field_pie_chart = create_pie_chart_base64(
                ['No Jobs Available'],
                [1],
                'Job Opening Field Ratio',
                ['#CCCCCC']
            )
        
        # Create bar chart for job field ratio
        if job_field_ratio and len(job_field_ratio) > 0:
            field_bar_chart = create_bar_chart_base64(
                list(job_field_ratio.keys()),
                list(job_field_ratio.values()),
                'Job Opening Field Distribution',
                'Job Field',
                'Percentage (%)',
                '#9966FF'
            )
        else:
            field_bar_chart = create_bar_chart_base64(
                ['No Jobs'],
                [0],
                'Job Opening Field Distribution',
                'Job Field',
                'Percentage (%)',
                '#9966FF'
            )
        
        # Create overview statistics chart
        overview_labels = ['Applications\nPending', 'Applications\nAccepted', 'Applications\nRejected', 'Interviews\nScheduled']
        overview_values = [
            status_counts['pending'],
            students_hired,
            students_rejected,
            interviews_scheduled
        ]
        overview_colors = ['#FFCE56', '#4BC0C0', '#FF6384', '#36A2EB']
        
        overview_chart = create_bar_chart_base64(
            overview_labels,
            overview_values,
            'Overall Application & Interview Statistics',
            'Category',
            'Count',
            '#36A2EB'
        )
        
        # Prepare response
        response = {
            "statistics": {
                "total_applications": total_applications,
                "applications_pending": status_counts['pending'],
                "applications_accepted": students_hired,
                "applications_rejected": students_rejected,
                "interviews_scheduled": interviews_scheduled,
                "students_hired": students_hired,
                "students_rejected": students_rejected
            },
            "charts": {
                "application_status_pie": status_pie_chart,
                "application_status_bar": status_bar_chart,
                "job_field_ratio_pie": field_pie_chart,
                "job_field_ratio_bar": field_bar_chart,
                "overview_chart": overview_chart
            },
            "job_field_ratio": job_field_ratio,
            "status_breakdown": status_counts
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analytics: {str(e)}")
