<?php

namespace App\Command;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UtilisateurManager extends Command
{
    protected static $defaultName = 'app:make:user';
    private $hasher;
    private $em;
    private $repo;

    public function __construct(UserPasswordHasherInterface $hasher, EntityManagerInterface $em, UtilisateurRepository $repo)
    {
        $this->hasher = $hasher;
        $this->em = $em;
        $this->repo = $repo;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Create, update or delete user')
            ->addArgument('mode', InputArgument::REQUIRED, 'Mode : create, update or delete')
            ->addArgument('login', InputArgument::REQUIRED, 'login')
            ->addArgument('nom', InputArgument::REQUIRED, 'nom')
            ->addArgument('prenom', InputArgument::REQUIRED, 'prenom')
            ->addArgument('mail', InputArgument::REQUIRED, 'mail')
            ->addArgument('password', InputArgument::OPTIONAL, 'User new password')
            ->addArgument('role', InputArgument::OPTIONAL, 'User role')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $mode = $input->getArgument('mode');
        $login = $input->getArgument('login');
        $nom = $input->getArgument('nom');
        $prenom = $input->getArgument('prenom');
        $mail = $input->getArgument('mail');

        if($mode == "create"){
            $user = new Utilisateur();
            $user->setLogin($login);
            $user->setNom($nom);
            $user->setPrenom($prenom);
            $user->setMail($mail);
        }
        elseif($mode == "update" || $mode == "delete"){
            $user = $this->repo->findOneBy(['username' => $login]);
            if(!$user){
                $io->error('Pas d\'utilisateur pour : '.$login);
                return Command::SUCCESS;
            }
            if($mode == "delete"){
                $this->em->remove($user);
                $io->success('L\'utilisateur '.$login.' a bien été supprimé');
                $this->em->flush();
                return Command::SUCCESS;
            }

        } else {
            $io->error('Choissez un mode parmis create, update ou delete');
            return Command::SUCCESS;
        }


        $newPassword = $input->getArgument('password');
        if(!$newPassword){
            $io->error('Veuillez saisir un MDP');
            return Command::SUCCESS;
        }
        $hashedPassword = $this->hasher->hashPassword($user,$newPassword);
        $user->setPassword($hashedPassword);


        $role = $input->getArgument('role');
        if($role){
            $user->setRoles(["ROLE_". strtoupper($role)]);
        };

        $this->em->persist($user);
        $this->em->flush();
        if($mode == "create"){
            $io->success($login.' a bien été créé.');
        } else {
            $io->success($login.' a bien été mis à jour.');
        }

        return Command::SUCCESS;
    }
}
