<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function listReports()
    {
        $reports = Report::getListReports();
        return response()->json([
            'status' => 'success',
            'data' => $reports
        ]);
    }
}
