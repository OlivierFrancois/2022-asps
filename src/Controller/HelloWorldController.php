<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HelloWorldController extends AbstractController
{
    #[Route('/HelloWorld', name: 'app_hello_world')]
    public function index(): Response
    {
        return $this->render('/home/index.html.twig');
    }
}
